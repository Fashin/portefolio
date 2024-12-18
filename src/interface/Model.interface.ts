import * as THREE from 'three';
import Animation from './Animation.interface';

export default interface Model {
    name: string,
    path: string,
    scale: Array<Number>|null,
    animations: Boolean|Array<Animation>,
    position: THREE.Vector3|Boolean,
    hide: Boolean,
    castShadow: Boolean,
    clickable: Boolean
}