import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {objectThreePosition} from '../../../models/types/objectThreePosition';
import * as THREE from 'three';
import {loadModelWithDraco} from '../../../utils/three-model-loader.util';
import {Group, Vector3} from 'three';
import {AnimationState} from '../../../models/types/animationState';
import {animateBounce, animateJump} from '../../../utils/animation.util';

@Component({
  selector: 'app-angular-logo',
  imports: [],
  templateUrl: './angular-logo.component.html',
  styleUrl: './angular-logo.component.css'
})
export class AngularLogoComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() modelLoaded = new EventEmitter<void>();

  @Input() canvasContainer!: HTMLDivElement;
  @Input() modelProps!: objectThreePosition
  @Input() scene!: THREE.Scene;
  @Input() camera!: THREE.PerspectiveCamera;
  @Input() renderer!: THREE.WebGLRenderer;

  private loadedModel: THREE.Object3D | null = null;
  private modelGroup!: THREE.Group;
  private glowLight: THREE.PointLight = new THREE.PointLight(0xff0000, 99, 0);
  //private lightHelper: THREE.PointLightHelper = new THREE.PointLightHelper(this.glowLight, 1, 0xee82ee); // 0.1 raggio piccolo;

  private gravity = -0.02;
  private bounceDamping = 0.6;
  private animationFrameId: number | null = null;
  private modelBottomOffset = 0;
  private initialPositionY = 0;
  private animationState!: AnimationState;
  private hoverTimeout: any = null;
  private hoverDuration = 1000; // tempo in ms che il modello resta "hovered"

  ngOnInit() {
    this.animationState = {
      bounceVelocity: 0,
      isHovered: false
    };
  }

  async ngAfterViewInit() {

    const model = await loadModelWithDraco(this.modelProps, '/models/angular.glb');

    // Imposta materiale rosso metallico
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
          color: 0xff0000,
          metalness: 1,
          roughness: 0.4,
        });
        child.receiveShadow = true;
      }
    });

    //trova il centro del modello e riscala il modello
    const box = new THREE.Box3().setFromObject(model);
    box.applyMatrix4(model.matrixWorld);
    const center = box.getCenter(new THREE.Vector3());
    //model.position.sub(center);

    const modelGroup = new THREE.Group();
    modelGroup.add(model);
    //modelGroup.position.copy(this.modelProps.position);
    // Ora ruota per togliere l'asse sbagliato
    modelGroup.rotation.y = Math.PI;

    this.modelGroup = modelGroup;

    if (this.canvasContainer.clientWidth > 230)
      this.addLights(model);

    //salva dati iniziali
    this.initialPositionY = model.position.y;

    this.modelGroup.traverse((child) => {
      child.layers.set(1); // Assicurati che anche la scritta sia nel layer 1
      child.layers.mask = 1;
      child.userData = {
        url: 'https://baddy2002.github.io/WebDesign/'
      };
    });
    this.camera.layers.enable(0);
    this.camera.layers.enable(1);

    console.log('Camera position:', this.camera.position);

    this.scene.add(this.modelGroup);
    this.modelLoaded.emit();

    //riscala su cordinate globali
    this.modelBottomOffset = model.position.y+8;
    this.notifyChangesOnResize(model);

    // Listener mouse over
    this.canvasContainer.addEventListener('pointermove', this.handlePointerMove);

    // Avvia animazione
    animateJump(
      model,
      this.modelProps,
      this.animationState,
      this.gravity,
      this.bounceDamping,
      this.modelBottomOffset,
      this.initialPositionY
    );

  }

  addLights(model: Group) {

    const lightPosition = this.positionateLights(model);
    this.glowLight.position.copy(lightPosition);
    //this.lightHelper = new THREE.PointLightHelper(this.glowLight, 1, 0xee82ee);
    this.modelGroup.add(this.glowLight);
    //this.modelGroup.add(this.lightHelper);

  }

  positionateLights(model: Group): Vector3 {
    // Calcola bounding box e centro
    const bbox = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    console.log('Center of model:', center);

    const lightOffset = new THREE.Vector3(model.position.x, 3, model.position.z * -1 + 6);
    const lightPosition = new THREE.Vector3().addVectors(center, lightOffset);
    console.log('Computed light position:', lightPosition);
    return lightPosition;
  }

  notifyChangesOnResize(model: Group) {
    //per aggiornare se necessario in caso di resize
    this.loadedModel = this.modelGroup;

    //aggiorna durante il resize
    window.addEventListener('resize', () => {

      this.renderer.setSize(this.canvasContainer.clientWidth, this.canvasContainer.clientHeight);
      this.camera.aspect = this.canvasContainer.clientWidth / this.canvasContainer.clientHeight;
      this.camera.updateProjectionMatrix();

      if (this.loadedModel) {
        // Applica i cambiamenti direttamente al modelGroup
        model.scale.set(this.modelProps.scale.x, this.modelProps.scale.y, this.modelProps.scale.z);
        model.position.set(this.modelProps.position.x, this.modelProps.position.y, this.modelProps.position.z);
        if (this.canvasContainer.clientWidth > 230)
          this.addLights(model);

      }
    });
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
      if (!isPresent) {
        return;
      }
      document.body.style.cursor = 'pointer';
      this.animationState.isHovered = true;
      this.animationState.bounceVelocity = 0.5;
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
        console.log("present in angular group");
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
