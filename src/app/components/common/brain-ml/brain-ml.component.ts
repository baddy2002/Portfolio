import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {objectThreePosition} from '../../../models/types/objectThreePosition';
import * as THREE from 'three';
import {loadModelWithDraco} from '../../../utils/three-model-loader.util';
import {Group} from 'three';
import {animateBounce} from '../../../utils/animation.util';
import {AnimationState} from '../../../models/types/animationState';
@Component({
  selector: 'app-brain-ml',
  imports: [],
  templateUrl: './brain-ml.component.html',
  styleUrl: './brain-ml.component.css'
})
export class BrainMlComponent implements AfterViewInit, OnDestroy {
  @Output() modelLoaded = new EventEmitter<void>();

  @Input() canvasContainer!: HTMLDivElement;
  @Input() modelProps!: objectThreePosition
  @Input() scene!: THREE.Scene;
  @Input() camera!: THREE.PerspectiveCamera;
  @Input() renderer!: THREE.WebGLRenderer;

  private loadedModel: THREE.Object3D | null = null;

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
  private hoverDuration = 2000; // tempo in ms che il modello resta "hovered"

  async ngAfterViewInit() {

    const model = await loadModelWithDraco(this.modelProps, '/models/brain.glb');
    model.layers.set(0);
    model.layers.mask=0;
    model.traverse(child => {
      child.userData = { url: 'https://baddy2002.github.io/AI/' };
      child.onBeforeRender = () => {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    //trova il centro del modello
    const box = new THREE.Box3().setFromObject(model);
    box.applyMatrix4(model.matrixWorld);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    const modelGroup = new THREE.Group();
    modelGroup.add(model);
    modelGroup.position.copy(this.modelProps.position);

    this.modelGroup = modelGroup;
    this.initialRotation.copy(this.modelGroup.rotation);
    this.initialPositionY = this.modelGroup.position.y;

    this.scene.add(this.modelGroup);
    this.modelLoaded.emit();

    this.modelBottomOffset = box.min.y - this.modelGroup.position.y;
    this.notifyChangesOnResize(model);

    this.animationState = {
      bounceVelocity: 0,
      isHovered: false
    };
    // Listener mouse over
    this.canvasContainer.addEventListener('pointermove', this.handlePointerMove);
    this.canvasContainer.addEventListener('mouseleave', () => this.animationState.isHovered = false);

    // Avvia animazione
    animateBounce(
      this.modelGroup,
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

  notifyChangesOnResize(model: Group) {
    //per aggiornare se necessario in caso di resize
    this.loadedModel = this.modelGroup;

    //aggiorna durante il resize
    window.addEventListener('resize', () => {

      this.renderer.setSize(this.canvasContainer.clientWidth, this.canvasContainer.clientHeight);
      this.camera.aspect = this.canvasContainer.clientWidth / this.canvasContainer.clientHeight;
      this.camera.updateProjectionMatrix();

      if (this.loadedModel) {
        model.scale.set(this.modelProps.scale.x, this.modelProps.scale.y, this.modelProps.scale.z);
        this.modelGroup.position.set(this.modelProps.position.x, this.modelProps.position.y, this.modelProps.position.z);
        model.rotation.set(this.modelProps.rotation.x, this.modelProps.rotation.y, this.modelProps.rotation.z);
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
      this.rotationVelocity.set(
        (Math.random() - 0.8) * 0.5,
        (Math.random() - 0.8) * 0.5,
        (Math.random() - 0.8) * 0.5,
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
