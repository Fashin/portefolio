import * as THREE from 'three';
import Model from "../interface/Model.interface"

export const models: Array<Model> = [
    {
        name: 'player',
        path: '/models/player.glb',
        scale: [.2, .2, .2],
        animations: [
            { name: 'runing', startOnLoad: false },
            { name: 'hidle', startOnLoad: false }
        ],
        position: new THREE.Vector3(0, 37.6, -10),
        hide: false,
        castShadow: false,
        clickable: false
    },
    {
        name: 'cliff',
        path: '/models/cliff.glb',
        scale: [20, 20, 20],
        animations: false,
        position: false,
        hide: false,
        castShadow: true,
        clickable: false
    },
    {
        name: 'slime',
        path: '/models/slime.glb',
        scale: [5, 5, 5],
        animations: [
            { name: 'waiting', startOnLoad: true }
        ],
        position: new THREE.Vector3(0, 37.6, 10),
        hide: false,
        castShadow: false,
        clickable: true
    },
    {
        name: 'firecamp',
        path: '/models/firecamp.glb',
        scale: [0.5, 0.5, 0.5],
        animations: false,
        position: new THREE.Vector3(0, 37.6, 0),
        hide: false,
        castShadow: false,
        clickable: true
    }
]