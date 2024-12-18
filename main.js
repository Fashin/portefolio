import State from './src/core/State.class';
import Game from './src/core/Game.class';
import ControlPlayer from './src/core/ControlPlayer.class';
import * as THREE from 'three';
import { models } from './src/config/models';
import ControlGravity from './src/core/ControlGravity.class';
import Dialogue from './src/core/Dialogue.class';
import Grass from './src/core/Grass.class';
import Fire from './src/core/Fire.class';

const state = new State()
const game = new Game(window, state)
const controlPlayer = new ControlPlayer(window, state)
const controlGravity = new ControlGravity()
const clock = new THREE.Clock()

game.init()

game.loadModels(models)

function animate() {
    requestAnimationFrame(animate);
    
    const { renderer, scene, camera, controls, water, grassMaterial, fireMaterial } = state.getState('document')
    const loaders = state.getState('loaders')
    const mixer = state.getState('mixer')
    const delta = clock.getDelta();

    if (!loaders || !loaders.models) return;

    // if (!loaders.load_grass) {
    //     const grass = new Grass(state)
    //     return;
    // }

    if (!loaders.load_fire) {
        const fire = new Fire(state)
        return;
    }

    if (!loaders.has_hide_loader) {
        const dialogue = new Dialogue(state)
        game.hideLoader()
    }
    
    water.material.uniforms['time'].value += 1.0 / 60.0;
    // grassMaterial.uniforms.time.value += 0.02;
    fireMaterial.uniforms.time.value += 0.05;

    controlGravity.handleGravity(state)

    if (controlGravity.isFalling)
        controlGravity.applyFall(state, delta)
    else
        controlPlayer.handleMovement(state, camera, controls, delta)

    if (controlGravity.hitUndermap(state))
        controlGravity.resetHitUndermap(state, camera, controls)

    mixer.update(delta)

    controls.update();

	renderer.render(scene, camera);
}

animate()


