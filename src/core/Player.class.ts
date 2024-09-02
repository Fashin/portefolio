export default class Player {
    MOVING_PROPERTIES: Object

    constructor(window: Window, state) {
        window.document.addEventListener('keydown', this.handleKeyEvent);
        window.document.addEventListener('keyup', this.handleKeyEvent);

        state.setState('player_control', {
            forward: false,
            left: false,
            right: false,
            backward: false
        })

        window.document.MOVING_PROPERTIES = {
            "KeyW": (value: boolean) => (state.setState('player_control', {...state.getState('player_control'), forward: value })),
            "KeyA": (value: boolean) => (state.setState('player_control', {...state.getState('player_control'), left: value })),
            "KeyD": (value: boolean) => (state.setState('player_control', {...state.getState('player_control'), right: value })),
            "KeyS": (value: boolean) => (state.setState('player_control', {...state.getState('player_control'), backward: value }))
        }
    }

    handleKeyEvent(evt) {
        if (window.document.MOVING_PROPERTIES.hasOwnProperty(evt.code))
            window.document.MOVING_PROPERTIES[evt.code](evt.type == 'keydown')
    }
}