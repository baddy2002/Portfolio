import {objectThreePosition} from '../models/types/objectThreePosition';
import {PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer} from 'three';

export function getHackerRoomModelResponsivePosition(width: number): objectThreePosition {
  if (width <= 230) {
    return {
      position: { x: 1, y: -5, z: 0 },
      rotation: { x: 0, y: -0.1 * Math.PI, z: 0 },
      scale: { x: 3, y: 3, z: 3 },
    };
  }

  if (width <= 300) {
    return {
      position: { x: 1, y: -10, z: 0 },
      rotation: { x: 0, y: -0.1 * Math.PI, z: 0 },
      scale: { x: 7, y: 7, z: 7 },
    };
  }

  if (width <= 440) {
    return {
      position: { x: 2, y: -10, z: 0 },
      rotation: { x: 0, y: -0.1 * Math.PI, z: 0 },
      scale: { x: 8, y: 8, z: 8 },
    };
  }

  if (width <= 768) {
    return {
      position: { x: 2, y: -10, z: 0 },
      rotation: { x: 0, y: -0.1 * Math.PI, z: 0 },
      scale: { x: 9, y: 9, z: 9 },
    };
  }

  if (width <= 1024) {
    return {
      position: { x: 2, y: -10, z: 0 },
      rotation: { x: 0, y: -0.1 * Math.PI, z: 0 },
      scale: { x: 10, y: 10, z: 10 },
    };
  }

  return {
    position: { x: 2, y: -15, z: 0 },
    rotation: { x: 0, y: -0.1 * Math.PI, z: 0 },
    scale: { x: 11, y: 11, z: 11 },
  };

}

export function getAtomQuantumModelResponsivePosition(width: number): objectThreePosition {
  return {
    position: calculateAtomPosition(width),
    rotation: {x: 0, y: 0, z: 0},
    scale: calculateAtomScale(width),
  }
}

function calculateAtomPosition(width: number):  { x: number; y: number , z: number } {

  // Parametri per posizionare l'atomo in base alla finestra
  const atomX = Math.min((width-60) / 42, 24); // posizionamento orizzontale centrato, regolato dalla larghezza
  const atomY = width<=440 ? 0.5 : -1.25; // posizione verticale (puoi regolarla per il livello della scrivania)
  const atomZ = 0; // posizione Z (non interessata, ma se vuoi puoi regolarla)

  console.log("position of atom", atomX, atomY, atomZ);
  return { x: -atomX, y: atomY, z: atomZ };
}

function calculateAtomScale(width: number):  { x: number; y: number , z: number } {

  // Parametri per posizionare l'atomo in base alla finestra
  const scale = Math.max(Math.min(width/300, 4), 1.75)+0.3;
  console.log("scale of atom", scale);
  return { x: scale, y: scale, z: scale };
}

export function getThunderboltHPCModelResponsivePosition(width: number): objectThreePosition {
  return {
    position: calculateThunderboltPosition(width),
    rotation: {x: Math.PI/2, y: Math.PI/2.2, z: 0},
    scale: calculateThunderboltScale(width),
  }
}

function calculateThunderboltPosition(width: number):  { x: number; y: number , z: number } {

  // Parametri per posizionare l'atomo in base alla finestra
  const atomX = Math.min((width-66) / 42, 28);
  const atomY = width<=440 ? 0.5 : -1.25; // posizione verticale (puoi regolarla per il livello della scrivania)
  const atomZ = 0; // posizione Z (non interessata, ma se vuoi puoi regolarla)

  console.log("position of thunder", atomX, atomY, atomZ);
  return { x: atomX, y: atomY, z: atomZ };
}

function calculateThunderboltScale(width: number):  { x: number; y: number , z: number } {

  // Parametri per posizionare l'atomo in base alla finestra
  const scaleX = 0.008*width+11.36;
  const scaleY = 0.04*width+16.8;
  const scaleZ = 0.0475*width+21.2;
  console.log("scale of thunder", scaleX, scaleY, scaleZ);
  return { x: scaleX, y: scaleY, z: scaleZ };
}

export function getJavaModelResponsivePosition(width: number): objectThreePosition {
  return {
    position: calculateJavaPosition(width),
    rotation: {x: 0, y: 0, z: 0},
    scale: calculateJavaScale(width),
  }
}

function calculateJavaPosition(width: number):  { x: number; y: number , z: number } {

  // Parametri per posizionare l'atomo in base alla finestra
  const javaX = Math.min((width-60) / 42, 26); // posizionamento orizzontale centrato, regolato dalla larghezza
  const javaY = width<=500 && width >= 230 ? -20 : -12.5; // posizione verticale (puoi regolarla per il livello della scrivania)
  const javaZ = 0; // posizione Z (non interessata, ma se vuoi puoi regolarla)

  console.log("position of java cup", javaX, javaY, javaZ);
  return { x: javaX, y: javaY, z: javaZ };
}

function calculateJavaScale(width: number):  { x: number; y: number , z: number } {

  // Parametri per posizionare l'atomo in base alla finestra
  const scale =width*0.0006+0.75;
  console.log("scale of java", scale);
  return { x: scale, y: scale, z: scale };
}

export function getBrainMLModelResponsivePosition(width: number): objectThreePosition {
  return {
    position: calculateBrainMLPosition(width),
    rotation: {x: 0, y: Math.PI/3, z: 0},
    scale: calculateBrainMLScale(width),
  }
}

function calculateBrainMLPosition(width: number):  { x: number; y: number , z: number } {

  // Parametri per posizionare l'atomo in base alla finestra
  const javaX = Math.min((width-60) / 42, 24); // posizionamento orizzontale centrato, regolato dalla larghezza
  const javaY = width<=500 && width >= 230 ? -20 : -12.5; // posizione verticale (puoi regolarla per il livello della scrivania)
  const javaZ = 0; // posizione Z (non interessata, ma se vuoi puoi regolarla)

  console.log("position of brain ml", javaX, javaY, javaZ);
  return { x: -javaX+0.00133*width, y: javaY+1, z: javaZ };
}

function calculateBrainMLScale(width: number):  { x: number; y: number , z: number } {

  // Parametri per posizionare l'atomo in base alla finestra
  const scale = width*0.0000075+0.0045;
  console.log("scale of brain", scale);
  return { x: scale, y: scale, z: scale };

}

export function getAngularModelResponsivePosition(width: number): objectThreePosition {
  return {
    position: calculateAngularPosition(width),
    rotation: {x: Math.PI/8, y: 0, z: Math.PI/30},
    scale: calculateAngularScale(width),
  }
}

function calculateAngularPosition(width: number):  { x: number; y: number , z: number } {
  if(width<=230){
    return {x: -0.5, y: -4.4, z: -5};
  }
  if(width<=300){
    return {x: 0.25, y: -8.4, z: -10};
  }
  if(width<=440){
    return {x: -0.5, y: -8.1, z: -12};
  }
  if(width<=768){
    return {x: -0.5, y: -8.1, z: -12};
  }
  if(width<=1024){
    return {x: -1, y: -8, z: -12};
  }
  return {
    x: -1, y: -13, z: -12
  };
  //300
  //250
}

function calculateAngularScale(width: number):  { x: number; y: number , z: number } {
  if(width<=230){
    return {x: 0.85, y: 0.85, z: 0.85};
  }
  if(width<=300){
    return {x: 2.0, y: 2.0, z: 2.0};
  }
  if(width<=440){
    return {x: 2.4, y: 2.4, z: 2.4};
  }
  if(width<=768){
    return {x: 2.6, y: 2.6, z: 2.6};
  }
  if(width<=1024){
    return {x: 2.8, y: 2.8, z: 2.8};
  }
  return {
    x: 3, y: 3, z: 3
  };
}



export function onMouseClick(event: MouseEvent,
                             mouse: Vector2, raycaster: Raycaster,
                             renderer: WebGLRenderer, scene: Scene,
                             camera : PerspectiveCamera
): void {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true); // true = cerca anche nei figli

  if (intersects.length > 0) {
  const objectClicked = intersects[0].object;
    console.log('Object user data:', objectClicked);
  // Qui puoi decidere
    if (objectClicked.userData?.['url']) {
      console.log('Redirect to:', objectClicked.userData?.['url']);
      window.location.href = objectClicked.userData['url'];
    }
}
}
