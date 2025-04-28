import {
  AfterViewInit,
  Component,
  EventEmitter, Input, Output,

} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import {setupCinematicLighting} from '../../utils/lighting.util';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {objectThreePosition} from '../../models/types/objectThreePosition';
import {loadModelWithDraco} from '../../utils/three-model-loader.util';

@Component({
  selector: 'app-three-hacker-room',
  imports: [
  ],
  templateUrl: './three-hacker-room.component.html',
  styleUrl: './three-hacker-room.component.css'
})
export class ThreeHackerRoomComponent implements AfterViewInit {

  @Output() modelLoaded = new EventEmitter<void>();

  @Input() canvasContainer!: HTMLDivElement;
  @Input() scene!: THREE.Scene;
  @Input() camera!: THREE.PerspectiveCamera;
  @Input() renderer!: THREE.WebGLRenderer;
  @Input() modelProps!: objectThreePosition

  private loadedModel: THREE.Object3D | null = null;

  async ngAfterViewInit() {
    if (!this.canvasContainer || !this.scene) {
      console.error('Errore: canvasContainer o scene non inizializzati!');
      return;
    }

    //add controls
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
// ✨ Attiva damping per movimenti fluidi
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

// 🔒 Blocca la rotazione verticale (up/down)
    controls.maxPolarAngle = Math.PI / 2.2; // leggermente sotto all’orizzonte
    controls.minPolarAngle = Math.PI / 2.2;

// 🔄 Permetti solo una leggera rotazione orizzontale
    controls.maxAzimuthAngle = 0.3; // sinistra
    controls.minAzimuthAngle = -0.3; // destra

// 🧭 Disabilita il pan (muovere la camera lateralmente)
    controls.enablePan = false;

// 🔍 Se vuoi: disattiva anche lo zoom, oppure limitane il range
    controls.minDistance = 25;
    controls.maxDistance = 35;

    setupCinematicLighting(this.scene);

    const model = await loadModelWithDraco(this.modelProps, '/models/laptop-desk.glb');
    this.loadedModel = model;
    model.layers.set(0);
    model.layers.mask=0;
    this.scene.add(model);
    this.modelLoaded.emit();

    //aggiorna durante il resize
    window.addEventListener('resize', () => {

      this.renderer.setSize(this.canvasContainer.clientWidth, this.canvasContainer.clientHeight);
      this.camera.aspect = this.canvasContainer.clientWidth / this.canvasContainer.clientHeight;
      this.camera.updateProjectionMatrix();

      if (this.loadedModel) {
        this.loadedModel.scale.set(this.modelProps.scale.x, this.modelProps.scale.y, this.modelProps.scale.z);
        this.loadedModel.position.set(this.modelProps.position.x, this.modelProps.position.y, this.modelProps.position.z);
        this.loadedModel.rotation.set(this.modelProps.rotation.x, this.modelProps.rotation.y, this.modelProps.rotation.z);
      }

    });

    const animateControls = () => {
      requestAnimationFrame(animateControls);
      controls.update();
    };
    animateControls();
  }

}
