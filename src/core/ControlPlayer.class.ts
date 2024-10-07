import * as THREE from 'three';
import Movement from "../interface/Movement.interface";
import State from './State.class';

export default class ControlPlayer {
    MOVING_PROPERTIES: Object
    MOVING_APPLICATION: Object
    SPEED: number = 50

    // Tmp data
    walkDirection = new THREE.Vector3()
    rotateAngle = new THREE.Vector3(0, 1, 0)
    rotateQuarternion: THREE.Quaternion = new THREE.Quaternion()
    cameraTarget = new THREE.Vector3()

    constructor(window: Window, state: State) {
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
            "forward": () => (0),
            "forward+left": () => (Math.PI / 4),
            "left+forward": () => (Math.PI / 4),
            "forward+right": () => (-Math.PI / 4),
            "right+forward": () => (-Math.PI / 4),
            "backward": () => (Math.PI),
            "backward+left": () => (Math.PI / 4 + Math.PI / 2 ),
            "left+backward": () => (Math.PI / 4 + Math.PI / 2 ),
            "backward+right": () => (-Math.PI / 4 - Math.PI / 2),
            "right+backward": () => (-Math.PI / 4 - Math.PI / 2),
            "left": () => (Math.PI / 2),
            "right": () => (-Math.PI / 2),
        }
    }

    public handleMovement(
        movementProperties: Movement,
        player: any,
        camera: any,
        player_animation: any,
        controls: any,
        delta: any
    )
        {
        const movements = Object.keys(movementProperties).filter(prop => (movementProperties[prop])).join('+')

        // User dont move
        if (movements.length === 0 || !this.MOVING_APPLICATION.hasOwnProperty(movements)) {
            player_animation.reset().fadeIn(.2).play()
            
            return;
        }
        else 
            player_animation.fadeOut(.2)

        const angleYCameraDirection = Math.atan2(
            (camera.position.x - player.position.x), 
            (camera.position.z - player.position.z)
        )

        const directionOffset = this.MOVING_APPLICATION[movements]()

        // rotate model
        this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset)
        player.quaternion.rotateTowards(this.rotateQuarternion, 0.2)

        camera.getWorldDirection(this.walkDirection)
        this.walkDirection.y = 0
        this.walkDirection.normalize()
        this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset)

        const moveX = this.walkDirection.x * this.SPEED * delta
        const moveZ = this.walkDirection.z * this.SPEED * delta
        player.position.x += moveX
        player.position.z += moveZ
        
        // move camera
        camera.position.x += moveX
        camera.position.z += moveZ

        // update camera target
        this.cameraTarget.x = player.position.x
        this.cameraTarget.y = player.position.y + 1
        this.cameraTarget.z = player.position.z
        controls.target = this.cameraTarget
    }

    private handleKeyEvent(evt) {
        if (window.document.MOVING_PROPERTIES.hasOwnProperty(evt.code))
            window.document.MOVING_PROPERTIES[evt.code](evt.type == 'keydown')
    }
}