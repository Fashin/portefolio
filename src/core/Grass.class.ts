import State from "./State.class";
import * as THREE from 'three';
import { grassFragmentShader, grassVertexShader } from "../shader/grass";

export default class Grass {
    constructor(state: State) {
        const cliff = state.getModel('cliff').scene
        const { scene } = state.getState('document')
        // Matériau pour le shader d'herbe
        const grassMaterial = new THREE.ShaderMaterial({
            vertexShader: grassVertexShader,
            fragmentShader: grassFragmentShader,
            uniforms: {
                time: { value: 0 }
            },
            transparent: true
        });

        const grassGeometry = new THREE.PlaneGeometry(0.02, 0.2);
        
        cliff.traverse((child) => {
            if (child.name !== 'highground') return

            let grassCount = 0
            const maxGrassCount = 10000
            const positions = child.geometry.attributes.position.array
            const modelMatrix = child.matrixWorld
            const box = new THREE.Box3().setFromObject(child)
            const min = box.min
            const max = box.max
            const exclusionCenter = new THREE.Vector3(0, 37.6, 10)
            const exclusionRadius = 5
            const secondExclusionCenter = new THREE.Vector3(0, 37.6, 0)
            const secondExclusionRadius = 2

            while (grassCount < maxGrassCount) {
                const index = Math.floor(Math.random() * (positions.length / 3))
    
                const x = positions[index * 3 + 0]
                const y = positions[index * 3 + 1]
                const z = positions[index * 3 + 2]
                const worldPosition = new THREE.Vector3(x, y, z).applyMatrix4(modelMatrix)
                const yVariation = (Math.random() - 0.5) * 1
                const newY = worldPosition.y + yVariation
                    const candidatePosition = new THREE.Vector3(
                    Math.random() * (max.x - min.x) + min.x,
                    newY,
                    Math.random() * (max.z - min.z) + min.z
                );
    
                if (this.isInsideComplexShape(candidatePosition, child) &&
                    !this.isInsideExclusionZone(candidatePosition, exclusionCenter, exclusionRadius) &&
                    !this.isInsideExclusionZone(candidatePosition, secondExclusionCenter, secondExclusionRadius)) {
                    const grass = new THREE.Mesh(grassGeometry, grassMaterial)

                    grass.position.copy(candidatePosition)
                    grass.rotation.set(0, Math.random() * Math.PI * 2, 0)

                    scene.add(grass)

                    grassCount++;
                }
            }
        })
        

        state.setState('document', {
            ...state.getState('document'),
            ...{
                grassMaterial
            }
        })
        state.setState('loaders', {
            ...state.getState('loaders'),
            ...{ load_grass: true }
        })
    }

    private isInsideComplexShape(point, model) {
        const raycaster = new THREE.Raycaster()
        const direction = new THREE.Vector3(0, -1, 0)
        raycaster.set(point, direction)

        const intersects = raycaster.intersectObject(model, true)

        return intersects.length > 0
    }

    private isInsideExclusionZone(position, center, radius) {
        const distance = Math.sqrt(
            Math.pow(position.x - center.x, 2) +
            Math.pow(position.z - center.z, 2)
        );

        return distance <= radius;
    }
} 