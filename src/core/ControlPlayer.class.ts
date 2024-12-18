import * as THREE from 'three';
import State from './State.class';

export default class ControlPlayer {
    MOVING_PROPERTIES: Object
    MOVING_APPLICATION: Object
    SPEED: number = 10

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
            "forward": 0,
            "forward+left": Math.PI / 4,
            "left+forward": Math.PI / 4,
            "forward+right": -Math.PI / 4,
            "right+forward": -Math.PI / 4,
            
            "backward": Math.PI,
            "backward+left": Math.PI - Math.PI / 4,
            "left+backward": Math.PI - Math.PI / 4,
            "backward+right": Math.PI + Math.PI / 4,
            "right+backward": Math.PI + Math.PI / 4,
            
            "left": Math.PI / 2,
            "right": -Math.PI / 2
        }
    }

    public handleMovement(state: any, camera: any, controls: any, delta: any) {
        const player_control = state.getState('player_control')
        const player = state.getModel('player')
        const runing_animation = state.getState('runing_animation')
        const hidle_animation = state.getState('hidle_animation')
        const movements = Object.keys(player_control).filter(prop => (player_control[prop])).join('+')

        // User dont move
        if (movements.length === 0 || !this.MOVING_APPLICATION.hasOwnProperty(movements)) {
            hidle_animation.play()
            runing_animation.reset().fadeIn(.2).play()
            
            return;
        }
        else 
            runing_animation.fadeOut(.2)

        const angleYCameraDirection = Math.atan2(
            (camera.position.x - player.scene.position.x), 
            (camera.position.z - player.scene.position.z)
        )

        const directionOffset = this.MOVING_APPLICATION[movements]

        let moveDelta = this.SPEED * delta

        // rotate model
        this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset)
        player.scene.quaternion.rotateTowards(this.rotateQuarternion, 0.2)

        camera.getWorldDirection(this.walkDirection)
        this.walkDirection.y = 0
        this.walkDirection.normalize()
        this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset)

        const moveX = this.walkDirection.x * moveDelta
        const moveZ = this.walkDirection.z * moveDelta
        player.scene.position.x += moveX
        player.scene.position.z += moveZ
        
        // move camera
        camera.position.x += moveX
        camera.position.z += moveZ

        // update camera target
        this.cameraTarget.x = player.scene.position.x
        this.cameraTarget.y = player.scene.position.y + 1
        this.cameraTarget.z = player.scene.position.z
        controls.target = this.cameraTarget

        player.hitbox.setFromObject(player.scene)
    }

    private teleport(x: Number, y: Number, z: Number, camera: any, player: any, controls: any) {
        camera.position.x = x
        camera.position.y = 5
        camera.position.z = z - 10
        player.scene.position.x = x
        player.scene.position.y = y
        player.scene.position.z = z
        this.cameraTarget.x = player.scene.position.x
        this.cameraTarget.y = player.scene.position.y + 1
        this.cameraTarget.z = player.scene.position.z
        controls.target = this.cameraTarget
        player.hitbox.setFromObject(player.scene)
    }

    private handleKeyEvent(evt) {
        if (window.document.MOVING_PROPERTIES.hasOwnProperty(evt.code))
            window.document.MOVING_PROPERTIES[evt.code](evt.type == 'keydown')
    }
}