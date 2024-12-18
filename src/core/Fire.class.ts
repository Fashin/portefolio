import State from "./State.class";
import * as THREE from 'three';
import { fireVertexShader, fireFragmentShader } from '../shader/fire'

export default class Fire {
    constructor(state: State) {
        const { scene } = state.getState('document')
        const fireGeometry = new THREE.ConeGeometry(0.5, 1, 64, 64);
        const fireMaterial = new THREE.ShaderMaterial({
            vertexShader: fireVertexShader,
            fragmentShader: fireFragmentShader,
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(0xff4500) }, // Rouge/orange
                color2: { value: new THREE.Color(0xffa500) }, // Orange/jaune
                color3: { value: new THREE.Color(0xffffff) }  // Blanc
            },
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
        });
        
        const fire = new THREE.Mesh(fireGeometry, fireMaterial);
        fire.position.set(0, 38.7, 0); 
        scene.add(fire);
        
        state.setState('document', {
            ...state.getState('document'),
            ...{
                fireMaterial
            }
        })
        state.setState('loaders', {
            ...state.getState('loaders'),
            ...{ load_fire: true }
        })
    }
}