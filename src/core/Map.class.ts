import * as THREE from 'three';

export default class Map {
    public init() {
        return new THREE.Mesh(
            new THREE.PlaneGeometry(300, 300).rotateX(-Math.PI * 0.5),
            new THREE.MeshBasicMaterial({
                color: new THREE.Color(0xC45B0F).multiplyScalar(1.5)
            })
        );
    }
}