import State from './src/core/State.class';
import Game from './src/core/Game.class';
import ControlPlayer from './src/core/ControlPlayer.class';
import * as THREE from 'three';
import { models } from './src/config/models';

const state = new State()
const game = new Game(window, state)
const controlPlayer = new ControlPlayer(window, state)
const clock = new THREE.Clock()

game.init()

game.loadModels(models)

// Création du Raycaster
const raycaster = new THREE.Raycaster();
const downVector = new THREE.Vector3(0, -1, 0); // Rayon vers le bas
let isFalling = false
let velocityY = 0

function animate() {
    requestAnimationFrame(animate);
    
    const { renderer, scene, camera, controls, water } = state.getState('document')
    const loaders = state.getState('loaders')
    const mixer = state.getState('mixer')
    const delta = clock.getDelta();

    if (!loaders || !loaders.models) return;

    if (!loaders.has_hide_loader) game.hideLoader()

    water.material.uniforms['time'].value += 1.0 / 60.0;

    const cliff = state.getModel('cliff').scene
    const character = state.getModel('player').scene
    const rayOrigin = character.position.clone()

    rayOrigin.y += 1
    raycaster.set(rayOrigin, downVector)

    const intersects = raycaster.intersectObject(cliff, true)

    if (intersects.length > 0) {
        const distanceToGround = intersects[0].distance

        if (distanceToGround > 1.5) {
            isFalling = true
        } else {
            isFalling = false;
            velocityY = 0
            character.position.y = intersects[0].point.y
        }
    } else {
        isFalling = true
    }

    if (isFalling) {
        velocityY -= 9.81 * delta
        character.position.y += velocityY * delta
    }
    else
        controlPlayer.handleMovement(state, camera, controls, delta)

    // Empêche le personnage de tomber trop bas (exemple : niveau du sol global)
    if (character.position.y < -10) {
        isFalling = false
        velocityY = 0
        character.position.x = 0
        character.position.y = 37.6
        character.position.z = 0
        controls.target.set(0, 41, 0);
        camera.position.set(0, 45, -10);
    }

    mixer.update(delta)

    controls.update();

	renderer.render(scene, camera);
}

animate()


