import * as THREE from 'three';

export default interface Model {
    name: string,
    path: string,
    scale: Array<Number>|null,
    animations: Boolean,
    position: THREE.Vector3,
    hide: Boolean
}