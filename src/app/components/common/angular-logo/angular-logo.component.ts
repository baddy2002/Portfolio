import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {objectThreePosition} from '../../../models/types/objectThreePosition';
import * as THREE from 'three';
import {loadModelWithDraco} from '../../../utils/three-model-loader.util';
import {Group, Vector3} from 'three';

@Component({
  selector: 'app-angular-logo',
  imports: [],
  templateUrl: './angular-logo.component.html',
  styleUrl: './angular-logo.component.css'
})
export class AngularLogoComponent implements AfterViewInit {
  @Output() modelLoaded = new EventEmitter<void>();

  @Input() canvasContainer!: HTMLDivElement;
  @Input() modelProps!: objectThreePosition
  @Input() scene!: THREE.Scene;
  @Input() camera!: THREE.PerspectiveCamera;
  @Input() renderer!: THREE.WebGLRenderer;

  private loadedModel: THREE.Object3D | null = null;
  private modelGroup!: THREE.Group;
  private glowLight: THREE.PointLight = new THREE.PointLight(0xff0000, 99, 0);
  private lightHelper: THREE.PointLightHelper = new THREE.PointLightHelper(this.glowLight, 1, 0xee82ee); // 0.1 raggio piccolo;

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

    this.modelGroup = new THREE.Group();
    // Ora ruota per togliere l'asse sbagliato
    this.modelGroup.rotation.y = Math.PI;

    this.modelGroup.add(model);

    if(this.canvasContainer.clientWidth>230)
      this.addLights(model);



    this.modelGroup.traverse((child) => {
      child.layers.set(1); // Assicurati che anche la scritta sia nel layer 1
      child.layers.mask=1;
    });
    this.camera.layers.enable(0);
    this.camera.layers.enable(1);

    console.log('Camera position:', this.camera.position);


    this.scene.add(this.modelGroup);
    this.modelLoaded.emit();


    this.notifyChangesOnResize(model);

  }

  addLights(model: Group)  {

     const lightPosition = this.positionateLights(model);
    this.glowLight.position.copy(lightPosition);
    this.lightHelper = new THREE.PointLightHelper(this.glowLight, 1, 0xee82ee);
    this.modelGroup.add(this.glowLight);
    this.modelGroup.add(this.lightHelper);

  }

  positionateLights(model: Group):Vector3 {
    // Calcola bounding box e centro
    const bbox = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    console.log('Center of model:', center);

    const lightOffset = new THREE.Vector3(model.position.x, 3, model.position.z*-1+6);
    const lightPosition =  new THREE.Vector3().addVectors(center, lightOffset);
    console.log('Computed light position:', lightPosition);
    return lightPosition;
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
        if(this.canvasContainer.clientWidth>230)
          this.addLights(model);

      }
    });
  }
}
