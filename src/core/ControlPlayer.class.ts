import Movement from "../interface/Movement.interface";

export default class ControlPlayer {
    MOVING_PROPERTIES: Object
    MOVING_APPLICATION: Object
    SPEED: number = 1

    constructor(window: Window, state) {
        window.document.addEventListener('keydown', this.handleKeyEvent);
        window.document.addEventListener('keyup', this.handleKeyEvent);

        state.setState('player_control', {
            forward: false,
            left: false,
            right: false,
            backward: false
        })

        // defined on window.document to handle addEventListener change context
        window.document.MOVING_PROPERTIES = {
            "KeyW": (value: boolean) => (state.setState('player_control', {...state.getState('player_control'), forward: value })),
            "KeyA": (value: boolean) => (state.setState('player_control', {...state.getState('player_control'), left: value })),
            "KeyD": (value: boolean) => (state.setState('player_control', {...state.getState('player_control'), right: value })),
            "KeyS": (value: boolean) => (state.setState('player_control', {...state.getState('player_control'), backward: value }))
        }

        this.MOVING_APPLICATION = {
            "forward": (player: any) => (player.position.z -= this.SPEED),
            "left": (player: any) => (player.position.x -= this.SPEED),
            "right": (player: any) => (player.position.x += this.SPEED),
            "backward": (player: any) => (player.position.z += this.SPEED)
        }
    }

    public handleMovement(movementProperties: Movement, player: any, controls: any, camera: any) {
        const movements = Object.keys(movementProperties).filter(prop => (movementProperties[prop]))

        for (let i in movements)
            this.MOVING_APPLICATION[movements[i]](player)

        // TODO : gestion de la hauteur/profond configurable (fov + scroll molette)
        camera.position.set(
            player.position.x,
            player.position.y + 10, // gestion de la hauteur de la caméra
            player.position.z + 15  // gestion de la profondeur de la caméra
        );

        camera.lookAt(player.position);
    }

    private handleKeyEvent(evt) {
        if (window.document.MOVING_PROPERTIES.hasOwnProperty(evt.code))
            window.document.MOVING_PROPERTIES[evt.code](evt.type == 'keydown')
    }
}