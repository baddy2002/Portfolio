import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {objectThreePosition} from '../../../models/types/objectThreePosition';
import * as THREE from 'three';
import {loadModelWithDraco} from '../../../utils/three-model-loader.util';
import {Group} from 'three';

@Component({
  selector: 'app-thunderbolt-hpc',
  imports: [],
  templateUrl: './thunderbolt-hpc.component.html',
  styleUrl: './thunderbolt-hpc.component.css'
})
export class ThunderboltHpcComponent implements AfterViewInit {
  @Output() modelLoaded = new EventEmitter<void>();

  @Input() canvasContainer!: HTMLDivElement;
  @Input() modelProps!: objectThreePosition
  @Input() scene!: THREE.Scene;
  @Input() camera!: THREE.PerspectiveCamera;
  @Input() renderer!: THREE.WebGLRenderer;

  private loadedModel: THREE.Object3D | null = null;

  async ngAfterViewInit() {

    const model = await loadModelWithDraco(this.modelProps, '/models/thunderbolt.glb');
    model.layers.set(0);
    // Calcola il centro del bounding box per posizionare la luce vicino al modello
    const bbox = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    bbox.getCenter(center);

    // Per evitare che illumini tutto, puoi anche usare un Group
    const modelGroup = new THREE.Group();

    //vera luce
    const glowLight = new THREE.PointLight(0xffff00, 3, 1); // luce gialla, intensa ma ravvicinata
    glowLight.position.copy(center);
    modelGroup.add(glowLight);

    //materiale più luminoso
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          color: 0xffff00,            // giallo brillante
          emissive: 0xffff00,         // emette luce gialla
          emissiveIntensity: 2,       // potenzia l’emissione
          metalness: 0.5,
          roughness: 0.3
        });
      }
    });

    modelGroup.add(model);
    this.scene.add(modelGroup);
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
