import {
  AfterViewInit,
  Component,
  EventEmitter, Input, Output,

} from '@angular/core';
import * as THREE from 'three';
import {setupCinematicLighting} from '../../utils/lighting.util';
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
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private rotationSpeed = 0.005;
  private rotationVelocity = { x: 0, y: 0 };
  private dampingFactor = 0.95; // valore tra 0.9 e 0.99 (più vicino a 1 => più lento il rallentamento)


  async ngAfterViewInit() {
    if (!this.canvasContainer || !this.scene) {
      console.error('Errore: canvasContainer o scene non inizializzati!');
      return;
    }
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
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.camera.aspect = this.canvasContainer.clientWidth / this.canvasContainer.clientHeight;
      this.camera.updateProjectionMatrix();

      if (this.loadedModel) {
        this.loadedModel.scale.set(this.modelProps.scale.x, this.modelProps.scale.y, this.modelProps.scale.z);
        this.loadedModel.position.set(this.modelProps.position.x, this.modelProps.position.y, this.modelProps.position.z);
        this.loadedModel.rotation.set(this.modelProps.rotation.x, this.modelProps.rotation.y, this.modelProps.rotation.z);
      }

    });


    this.canvasContainer.addEventListener('mousedown', (event) => {
      this.isDragging = true;
      this.previousMousePosition = { x: event.clientX, y: event.clientY };
    });

    this.canvasContainer.addEventListener('mousemove', (event) => {
      if (!this.isDragging || !this.loadedModel) return;

      const deltaMove = {
        x: event.clientX - this.previousMousePosition.x,
        y: event.clientY - this.previousMousePosition.y,
      };

      // Quando trascini, aggiorni la velocità di rotazione
      this.rotationVelocity.y = deltaMove.x * this.rotationSpeed;
      this.rotationVelocity.x = deltaMove.y * this.rotationSpeed;

      this.previousMousePosition = { x: event.clientX, y: event.clientY };
    });

    this.canvasContainer.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.canvasContainer.addEventListener('mouseleave', () => {
      this.isDragging = false;
    });

    // Animate loop
    const animateControls = () => {
      requestAnimationFrame(animateControls);

      if (this.loadedModel) {
        // Applica la velocità di rotazione
        this.loadedModel.rotation.y += this.rotationVelocity.y;
        this.loadedModel.rotation.x += this.rotationVelocity.x;

        // Applica il damping per rallentare gradualmente
        this.rotationVelocity.x *= this.dampingFactor;
        this.rotationVelocity.y *= this.dampingFactor;
      }

      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.render(this.scene, this.camera);
    };
    animateControls();
  }

}
