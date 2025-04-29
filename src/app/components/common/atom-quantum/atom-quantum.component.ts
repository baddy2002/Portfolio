import {
  Component,
  OnInit,
  AfterViewInit,
  Input, Output, EventEmitter,
} from '@angular/core';
import * as THREE from 'three';
import {objectThreePosition} from '../../../models/types/objectThreePosition';
import {onMouseClick} from '../../../utils/responsive-position.util';
import {AnimationState} from '../../../models/types/animationState';
import {animateBounce} from '../../../utils/animation.util';

@Component({
  selector: 'app-atom-quantum',
  templateUrl: './atom-quantum.component.html',
  styleUrls: ['./atom-quantum.component.css'],
})
export class AtomQuantumComponent implements AfterViewInit {

  @Output() modelLoaded = new EventEmitter<void>();

  @Input() canvasContainer!: HTMLDivElement;
  @Input() modelProps!: objectThreePosition
  @Input() electronCount: number = 1; // da 1 a 4
  @Input() nucleusColor: number = 0xA6FFC9; // verde menta chiaro
  @Input() electronColor: number = 0x009688; // verde acqua scuro
  @Input() orbitColor: number = 0xB2FFEB; // verde chiaro semi-trasparente
  @Input() scene!: THREE.Scene;
  @Input() camera!: THREE.PerspectiveCamera;
  @Input() renderer!: THREE.WebGLRenderer;

  private atomGroup!: THREE.Group;
  private electronGroups: THREE.Group[] = [];
  private loadedModel: THREE.Object3D | null = null;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  private gravity = -0.02;
  private bounceDamping = 0.6;
  private animationFrameId: number | null = null;
  private modelGroup: THREE.Group = new THREE.Group();
  private modelBottomOffset = 0;
  private rotationVelocity = new THREE.Vector3(0, 0, 0);
  private initialRotation = new THREE.Euler();
  private initialPositionY = 0;
  private animationState!: AnimationState;
  private hoverTimeout: any = null;
  private hoverDuration = 1000; // tempo in ms che il modello resta "hovered"


  ngAfterViewInit(): void {

    this.atomGroup = new THREE.Group();
    // Nucleo
    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.15),
      new THREE.MeshStandardMaterial({ color: this.nucleusColor })
    );
    this.atomGroup.add(nucleus);

    //aggiungi elettroni e orbite
    for (let i = 0; i < Math.min(this.electronCount, 4); i++) {
      const radius = 0.5;

      //gruppo orbitale con orbite distribuite
      const orbitGroup = new THREE.Group();
      orbitGroup.rotation.set(
        Math.PI / 4 * (i % 2), // 0 o π/4
        Math.PI / 2 * (i % 4) / 4, // 0, π/8, π/4, 3π/8
        Math.PI / 3 * (i % 3) / 3  // 0, π/9, 2π/9
      );

      const orbit = new THREE.RingGeometry(radius, radius + 0.015, 64);
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: this.orbitColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      });
      const orbitMesh = new THREE.Mesh(orbit, orbitMaterial);

      orbitGroup.add(orbitMesh);
      this.atomGroup.add(orbitGroup);

      // Elettrone
      const electron = new THREE.Mesh(
        new THREE.SphereGeometry(0.05),
        new THREE.MeshStandardMaterial({ color: this.electronColor })
      );
      electron.position.x = radius;

      // Gruppo che ruota l'elettrone attorno all'asse
      const electronGroup = new THREE.Group();
      electronGroup.add(electron);
      electronGroup.rotation.copy(orbitGroup.rotation);

      this.atomGroup.add(electronGroup);
      this.electronGroups.push(electronGroup);
    }

    // Posizione e scala
    this.atomGroup.scale.set(this.modelProps.scale.x, this.modelProps.scale.y, this.modelProps.scale.z);
    this.atomGroup.position.set(this.modelProps.position.x, this.modelProps.position.y, this.modelProps.position.z);


    //finisce il caricamento su hero
    this.modelLoaded.emit();
    this.atomGroup.traverse((child) =>{
      child.userData = {
        url:  'https://baddy2002.github.io/Quantum/'
      };
    });
    this.modelGroup = this.atomGroup;
    this.initialRotation.copy(this.atomGroup.rotation);
    this.initialPositionY = this.atomGroup.position.y;

    this.scene.add(this.modelGroup);
    //per aggiornare se necessario in caso di resize
    this.loadedModel=this.modelGroup;

    this.modelBottomOffset = this.atomGroup.position.y+1;

    window.addEventListener('resize', () => {
      this.renderer.setSize(this.canvasContainer.clientWidth, this.canvasContainer.clientHeight);
      this.camera.aspect = this.canvasContainer.clientWidth / this.canvasContainer.clientHeight;
      this.camera.updateProjectionMatrix();


      if (this.loadedModel) {
        this.loadedModel.position.set(this.modelProps.position.x, this.modelProps.position.y, this.modelProps.position.z);
        this.loadedModel.scale.set(this.modelProps.scale.x, this.modelProps.scale.y, this.modelProps.scale.z);
      }
    });

    this.renderer.domElement.addEventListener('click', (event) => onMouseClick(event, this.mouse, this.raycaster, this.renderer, this.scene, this.camera));

    this.animationState = {
      bounceVelocity: 0,
      isHovered: false
    };

    // Listener mouse over
    this.canvasContainer.addEventListener('pointermove', this.handlePointerMove);

    // Avvia animazione
    animateBounce(
      this.atomGroup,
      this.modelProps,
      this.animationState,
      this.gravity,
      this.bounceDamping,
      this.rotationVelocity,
      this.modelBottomOffset,
      this.initialRotation,
      this.initialPositionY
    );
  }

  public tick(delta: number): void {
    // Ruota l’atomo
    this.atomGroup.rotation.y += 0.005*delta;

    // Ruota gli elettroni
    for (const group of this.electronGroups) {
      group.rotation.z += 0.05*delta;
    }
  }


  private handlePointerMove = (event: MouseEvent) => {
    const rect = this.canvasContainer.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0 && !this.animationState.isHovered) {
      let isPresent = false;
      const intersects = raycaster.intersectObject(this.modelGroup, true);
      for (let length = 0; length < intersects.length; length++) {
        const objectOvered = intersects[length].object;
        if (objectOvered.id === this.modelGroup.id || this.isObjectInGroup()) {
          isPresent = true;
        }
      }
      console.log("event listened");
      console.log("isPresent", isPresent);
      if (!isPresent) {
        return;
      }
      document.body.style.cursor = 'pointer';
      this.animationState.isHovered = true;
      this.animationState.bounceVelocity = 0.5;
      this.rotationVelocity.set(
        (Math.random() - 0.8) * 0.3,
        (Math.random() - 0.8) * 0.3,
        (Math.random() - 0.8) * 0.3
      );
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = setTimeout(() => {
        this.animationState.isHovered = false;
        document.body.style.cursor = 'default';
      }, this.hoverDuration);
    }
  };

  private isObjectInGroup(): boolean {
    let isPresent = false;
    this.modelGroup.traverse((child: THREE.Object3D) => {
      if (child.id === this.modelGroup.id) {
        isPresent = true;
      }
    });
    return isPresent;
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.canvasContainer.removeEventListener('pointermove', this.handlePointerMove);
  }

}
