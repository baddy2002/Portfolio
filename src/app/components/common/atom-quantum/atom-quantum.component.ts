import {
  Component,
  OnInit,
  AfterViewInit,
  Input, Output, EventEmitter,
} from '@angular/core';
import * as THREE from 'three';
import {objectThreePosition} from '../../../models/types/objectThreePosition';

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

  ngAfterViewInit(): void {

    this.atomGroup = new THREE.Group();
    // Nucleo
    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.15),
      new THREE.MeshStandardMaterial({ color: this.nucleusColor })
    );
    this.atomGroup.add(nucleus);
    const fixedRotations = [
      new THREE.Euler(0, 0, 0),
      new THREE.Euler(Math.PI / 3, 0, 0),
      new THREE.Euler(0, Math.PI / 3, 0),
      new THREE.Euler(0, 0, Math.PI / 3),
    ];
    //aggiungi elettroni e orbite
    for (let i = 0; i < Math.min(this.electronCount, 4); i++) {
      const radius = 0.5;

      //gruppo orbitale con orbite distribuite
      const orbitGroup = new THREE.Group();
      orbitGroup.rotation.copy(fixedRotations[i % fixedRotations.length]);

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

    this.atomGroup.traverse((child) => {
      child.layers.set(0);
    });

    //finisce il caricamento su hero
    this.modelLoaded.emit();

    this.scene.add(this.atomGroup);
    //per aggiornare se necessario in caso di resize
    this.loadedModel=this.atomGroup;

    window.addEventListener('resize', () => {
      this.renderer.setSize(this.canvasContainer.clientWidth, this.canvasContainer.clientHeight);
      this.camera.aspect = this.canvasContainer.clientWidth / this.canvasContainer.clientHeight;
      this.camera.updateProjectionMatrix();


      if (this.loadedModel) {
        this.loadedModel.position.set(this.modelProps.position.x, this.modelProps.position.y, this.modelProps.position.z);
        this.loadedModel.scale.set(this.modelProps.scale.x, this.modelProps.scale.y, this.modelProps.scale.z);
      }
    });
  }

  public tick(): void {
    // Ruota l’atomo
    this.atomGroup.rotation.y += 0.005;

    // Ruota gli elettroni
    for (const group of this.electronGroups) {
      group.rotation.z += 0.05;
    }
  }

}
