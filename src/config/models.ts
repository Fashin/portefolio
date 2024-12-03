import * as THREE from 'three';
import Model from "../interface/Model.interface"

export const models: Array<Model> = [
    {
        name: 'player',
        path: '/models/player.glb',
        scale: [.2, .2, .2],
        animations: true,
        position: new THREE.Vector3(0, 37.6, 0),
        hide: false,
        castShadow: false
    },
    {
        name: 'cliff',
        path: '/models/cliff.glb',
        scale: [20, 20, 20],
        animations: false,
        position: false,
        hide: false,
        castShadow: true
    }
]