// utils/animation-utils.ts
import * as THREE from 'three';
import {AnimationState} from '../models/types/animationState';


export const animateBounce = (
  modelGroup: THREE.Group,
  modelProps: any,
  state: AnimationState,
  gravity: number,
  bounceDamping: number,
  rotationVelocity: THREE.Vector3,
  modelBottomOffset: number,
  initialRotation: THREE.Euler,
  initialPositionY: number
) => {
  requestAnimationFrame(() => animateBounce(modelGroup, modelProps, state, gravity, bounceDamping, rotationVelocity, modelBottomOffset, initialRotation, initialPositionY));

  if (!modelGroup) return;

  if (state.isHovered || state.bounceVelocity !== 0) {
    state.bounceVelocity += gravity;
    modelGroup.position.y += state.bounceVelocity;

    modelGroup.rotation.y += 0.05;
    modelGroup.rotation.x += 0.05;
    modelGroup.rotation.z += 0.05;

    const currentBottomY = modelGroup.position.y + modelBottomOffset;
    if (currentBottomY <= modelProps.position.y) {
      modelGroup.position.y = modelProps.position.y - modelBottomOffset;
      state.bounceVelocity = -state.bounceVelocity * bounceDamping;

      rotationVelocity.multiplyScalar(bounceDamping);

      if (Math.abs(state.bounceVelocity) < 0.01 && rotationVelocity.length() < 0.001) {
        state.bounceVelocity = 0;
        rotationVelocity.set(0, 0, 0);
        state.isHovered = false;

        modelGroup.position.y = initialPositionY;
        modelGroup.rotation.copy(initialRotation);
      }
    }
  }
};

