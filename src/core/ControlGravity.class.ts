import * as THREE from 'three';
import State from "./State.class";

export default class controlGravity {
    raycaster = new THREE.Raycaster()
    downVector = new THREE.Vector3(0, -1, 0)
    velocityY = 0
    isFalling = false

    public handleGravity(state: State) {
        const cliff = state.getModel('cliff').scene
        const player = state.getModel('player').scene
        const rayOrigin = player.position.clone()
    
        rayOrigin.y += 1
        this.raycaster.set(rayOrigin, this.downVector)
    
        const intersects = this.raycaster.intersectObject(cliff, true)
    
        if (intersects.length > 0) {
            const distanceToGround = intersects[0].distance
    
            if (distanceToGround > 1.5) {
                this.isFalling = true
            } else {
                this.velocityY = 0
                player.position.y = intersects[0].point.y

                this.isFalling = false
            }
        }
        else
            this.isFalling = true
    }

    public applyFall(state: State, delta) {
        const player = state.getModel('player').scene

        this.velocityY -= 9.81 * delta
        player.position.y += this.velocityY * delta
    }

    public resetHitUndermap(state: State, camera: any, controls: any) {
        const player = state.getModel('player').scene

        this.velocityY = 0
        this.isFalling = false

        player.position.x = 0
        player.position.y = 37.6
        player.position.z = -10
        
        controls.target.set(0, 41, -10)
        camera.position.set(0, 45, -20)
    }

    public hitUndermap(state: State) {
        const player = state.getModel('player').scene

        return player.position.y < -10
    }
}