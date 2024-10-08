import State from './src/core/State.class';
import Game from './src/core/Game.class';
import ControlPlayer from './src/core/ControlPlayer.class';
import Map from './src/components/Map.class';

import * as THREE from 'three';

const state = new State()
const game = new Game(window, state)
const controlPlayer = new ControlPlayer(window, state)
const clock = new THREE.Clock()

game.init()

game.loadModels([
    {
        name: 'player',
        path: '/player.glb',
        scale: [.5, .5, .5],
        animations: true
    },
    {
        name: 'musee',
        path: '/batiment_musee.glb',
        scale: [1, 1, 1],
        position: new THREE.Vector3(0, -4, 200)
    },
    {
        name: 'fence',
        path: '/fence.glb',
        scale: [1, 1, 1],
        hide: true
    }
])

function animate() {
    requestAnimationFrame(animate);

    const { renderer, scene, camera, controls } = state.getState('document')
    const loaders = state.getState('loaders')
    const mixer = state.getState('mixer')
    const delta = clock.getDelta();

    if (!loaders || !loaders.models) return;

    if (!loaders.has_map_loaded) new Map(state)

    if (!loaders.has_hide_loader) game.hideLoader()

    controlPlayer.handleMovement(state, camera, controls, delta)

    mixer.update(delta)

    controls.update();

	renderer.render(scene, camera);    
}

animate()


