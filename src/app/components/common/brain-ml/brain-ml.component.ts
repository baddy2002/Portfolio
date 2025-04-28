import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {objectThreePosition} from '../../../models/types/objectThreePosition';
import * as THREE from 'three';
import {loadModelWithDraco} from '../../../utils/three-model-loader.util';
import {Group} from 'three';

@Component({
  selector: 'app-brain-ml',
  imports: [],
  templateUrl: './brain-ml.component.html',
  styleUrl: './brain-ml.component.css'
})
export class BrainMlComponent implements AfterViewInit {
  @Output() modelLoaded = new EventEmitter<void>();

  @Input() canvasContainer!: HTMLDivElement;
  @Input() modelProps!: objectThreePosition
  @Input() scene!: THREE.Scene;
  @Input() camera!: THREE.PerspectiveCamera;
  @Input() renderer!: THREE.WebGLRenderer;

  private loadedModel: THREE.Object3D | null = null;

  async ngAfterViewInit() {

    const model = await loadModelWithDraco(this.modelProps, '/models/brain.glb');
    model.layers.set(0);
    const modelGroup = new THREE.Group();
    modelGroup.add(model);
    modelGroup.traverse((child: THREE.Object3D) => {
      child.userData = {
        url: 'https://baddy2002.github.io/AI/',
      }
    })
    this.scene.add(model);
    this.modelLoaded.emit();


    this.notifyChangesOnResize(model);

  }

  notifyChangesOnResize(model: Group) {
    //per aggiornare se necessario in caso di resize
    this.loadedModel = model;

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
  }
}
