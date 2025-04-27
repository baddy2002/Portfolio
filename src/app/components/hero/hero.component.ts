import {
  AfterViewInit,
  Component, ElementRef, HostListener, OnInit, ViewChild
} from '@angular/core';
import * as THREE from 'three';
import { AtomQuantumComponent } from '../common/atom-quantum/atom-quantum.component';
import { ThreeHackerRoomComponent } from '../three-hacker-room/three-hacker-room.component';
import {DecimalPipe, NgIf} from '@angular/common';
import {
  getAngularModelResponsivePosition,
  getAtomQuantumModelResponsivePosition, getBrainMLModelResponsivePosition,
  getHackerRoomModelResponsivePosition, getJavaModelResponsivePosition, getThunderboltHPCModelResponsivePosition
} from '../../utils/responsive-position.util';
import {objectThreePosition} from '../../models/types/objectThreePosition';
import {ThunderboltHpcComponent} from '../common/thunderbolt-hpc/thunderbolt-hpc.component';
import {setupCinematicLighting} from '../../utils/lighting.util';
import {JavaLogoComponent} from '../common/java-logo/java-logo.component';
import {BrainMlComponent} from '../common/brain-ml/brain-ml.component';
import {AngularLogoComponent} from '../common/angular-logo/angular-logo.component';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  standalone: true,
  imports: [
    AtomQuantumComponent,
    ThreeHackerRoomComponent,
    DecimalPipe,
    NgIf,
    ThunderboltHpcComponent,
    JavaLogoComponent,
    BrainMlComponent,
    AngularLogoComponent
  ]
})
export class HeroComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasContainer', { static: true }) canvasContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('quantumComponent') atomComponent!: AtomQuantumComponent;
  loading = true;
  modelsLoaded = 0;
  totalModels = 6;

  modelAtomProps!: objectThreePosition;
  modelThunderboltProps!: objectThreePosition;
  modelJavaProps!: objectThreePosition;
  modelAngularProps!: objectThreePosition;
  modelBrainProps!: objectThreePosition;
  modelHackerRoomProps!: objectThreePosition;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  divContainer!: HTMLDivElement;

  ngOnInit() {
    this.initThree();
    this.updateModelProps();
    setupCinematicLighting(this.scene);
    this.animate();

  }

  ngAfterViewInit() {
    window.addEventListener('resize', () => {
      this.updateModelProps();
    });
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.divContainer = this.canvasContainerRef.nativeElement;
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.divContainer.clientWidth / this.divContainer.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 30;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas.nativeElement,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(this.divContainer.clientWidth, this.divContainer.clientHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = true;
    this.divContainer.appendChild(this.renderer.domElement);

  }

  updateModelProps() {
    this.modelAtomProps = this.defineAtomQuantumProps();
    this.modelHackerRoomProps = this.defineHackerRoomProps();
    this.modelThunderboltProps = this.defineThunderboltProps();
    this.modelJavaProps = this.defineJavaProps();
    this.modelAngularProps = this.defineAngularProps();
    this.modelBrainProps = this.defineBrainMLProps();

  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.atomComponent?.tick(); // chiama il tick del componente
    this.renderer.render(this.scene, this.camera);
  }

  defineHackerRoomProps(): objectThreePosition{
    return getHackerRoomModelResponsivePosition(window.innerWidth)
  }

  defineAtomQuantumProps(): objectThreePosition{
    return getAtomQuantumModelResponsivePosition(window.innerWidth)
  }

  defineThunderboltProps(): objectThreePosition{
    return getThunderboltHPCModelResponsivePosition(window.innerWidth)
  }

  defineJavaProps(): objectThreePosition{
    return getJavaModelResponsivePosition(window.innerWidth)
  }

  defineAngularProps(): objectThreePosition{
    return getAngularModelResponsivePosition(window.innerWidth)
  }

  defineBrainMLProps(): objectThreePosition{
    return getBrainMLModelResponsivePosition(window.innerWidth)
  }

  onChildModelLoaded() {
    this.modelsLoaded++;
    if (this.modelsLoaded >= this.totalModels) {
      this.loading = false;
    }
  }


}
