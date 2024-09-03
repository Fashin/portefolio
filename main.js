import State from './src/core/State.class';
import Game from './src/core/Game.class';
import Map from './src/core/Map.class';
import ControlPlayer from './src/core/ControlPlayer.class';

const state = new State()
const game = new Game(window, state)
const controlPlayer = new ControlPlayer(window, state)

game.init([
    new Map()
])

game.loadModels([
    {
        key: 'player',
        path: '/slime.glb'
    }
])

function animate() {
    requestAnimationFrame(animate);

    const { renderer, scene, camera, controls } = state.getState('document')
    const player = state.getState('player')

    if (player)
        controlPlayer.handleMovement(
            state.getState('player_control'),
            player,
            controls,
            camera
        )

	renderer.render(scene, camera);
}

animate()
