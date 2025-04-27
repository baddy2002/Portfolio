import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as THREE from 'three';
import {objectThreePosition} from '../models/types/objectThreePosition';
import {Group} from 'three';

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath('/assets/draco/');
gltfLoader.setDRACOLoader(dracoLoader);

export function loadModelWithDraco(modelProps: objectThreePosition, loadPath: string): Promise<Group> {
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      loadPath,
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(modelProps.scale.x, modelProps.scale.y, modelProps.scale.z);
        model.position.set(modelProps.position.x, modelProps.position.y, modelProps.position.z);
        model.rotation.set(modelProps.rotation.x, modelProps.rotation.y, modelProps.rotation.z);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        resolve(model);
      },
      undefined,
      (error) => reject(error)
    );
  });
}
