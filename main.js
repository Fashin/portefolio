import State from './src/core/State.class';
import Game from './src/core/Game.class';
import Map from './src/core/Map.class';
import Player from './src/core/Player.class';

const state = new State()
const game = new Game(window, state)
const player = new Player(window, state)

game.init([
    new Map()
])

game.loadModels([
    {
        key: 'player',
        path: '/slime.glb'
    }
]) 

const speed = 0.05

function animate() {
    const { renderer, scene, camera, controls } = state.getState('document')
    const player = state.getState('player')

    // TODO : fuck les forêts d'if
    if (player) {
        const { forward, left, right, backward } = state.getState('player_control')

        if (forward) player.position.z -= speed
        if (left) player.position.x -= speed
        if (right) player.position.x += speed
        if (backward) player.position.z += speed
    }

	requestAnimationFrame(animate);

    controls.update();

	renderer.render(scene, camera);
}

animate()
