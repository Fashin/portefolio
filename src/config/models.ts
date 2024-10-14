import * as THREE from 'three';
import Model from "../interface/Model.interface"

export const models: Array<Model> = [
    {
        name: 'player',
        path: '/models/player.glb',
        scale: [.5, .5, .5],
        animations: true,
        position: false,
        hide: false
    },
    {
        name: 'musee',
        path: '/models/batiment_musee.glb',
        scale: [1, 1, 1],
        position: new THREE.Vector3(0, -4, 200),
        animations: false,
        hide: false
    },
    {
        name: 'fence',
        path: '/models/fence.glb',
        scale: [1, 1, 1],
        hide: true,
        animations: false,
        position: false
    },
    {
        name: 'paint',
        path: '/models/paint.glb',
        scale: [1, 1, 1],
        hide: true,
        animations: false,
        position: false
    }
]