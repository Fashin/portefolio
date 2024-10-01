import State from './src/core/State.class';
import Game from './src/core/Game.class';
import ControlPlayer from './src/core/ControlPlayer.class';

import Map from './src/components/Map.class';

import * as THREE from 'three';

const state = new State()
const game = new Game(window, state)
const controlPlayer = new ControlPlayer(window, state)
const clock = new THREE.Clock()

game.init([
    new Map()
])

game.loadModels([
    {
        name: 'player',
        path: '/player1.0.glb',
        scale: [.5, .5, .5],
        animations: true
    },
    {
        name: 'musee',
        path: '/batiment_musee.glb',
        scale: [1, 1, 1],
        position: new THREE.Vector3(0, -4, 200)
    }
])

function animate() {
    requestAnimationFrame(animate);

    const { renderer, scene, camera, controls } = state.getState('document')
    const player = state.getState('player')
    const player_animation = state.getState('player_animation')
    const player_control = state.getState('player_control')
    const mixer = state.getState('mixer')
    const delta = clock.getDelta();

    if (player) {  
        controlPlayer.handleMovement(
            player_control,
            player,
            camera,
            player_animation,
            controls,
            delta
        )
    }

    if (mixer)
        mixer.update(delta)

    controls.update();

	renderer.render(scene, camera);    
}

animate()


