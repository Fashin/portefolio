import * as THREE from 'three';
import State from '../core/State.class';

export default class Map {
    public constructor(state: State) {
        const { scene } = state.getState('document')

        // generate ground
        const groundTexture = new THREE.TextureLoader().load('/materials/ground.png')
        const roadTexture = new THREE.TextureLoader().load('/materials/road.jpg')

        for (let i = -400; i < 400; i += 20) {
            for (let j = -400; j < 400; j += 20) {
                const ground = new THREE.Mesh(
                    new THREE.PlaneGeometry(20, 20).rotateX(-Math.PI * 0.5),
                    new THREE.MeshBasicMaterial({
                        map: i > -40 && i < 40 ? roadTexture : groundTexture,
                        reflectivity: 0
                    })
                );

                ground.position.x = i
                ground.position.z = j

                scene.add(ground)
            }
        }

        //add fence
        const fence = state.getModel('fence').scene
        const rotateOS = Math.PI / 2
        const rotateES = -Math.PI / 2

        for (let i = -366; i < 366; i += 44) {
            //Ouest->Sud
            const fOS = fence.clone()
            fOS.position.x = -366
            fOS.rotation.y = rotateOS
            fOS.position.z = i
            scene.add(fOS)

            //Ouest->Est
            const fOE = fence.clone()
            fOE.position.x = i
            fOE.position.z = -366
            scene.add(fOE)

            //Est->Sud
            const fES = fence.clone()
            fES.position.x = 366
            fES.rotation.y = rotateES
            fES.position.z = i
            scene.add(fES)
        }

        // hitbox for fences
        const baseGeometry = new THREE.BoxGeometry(732, 100)
        const baseMaterial = new THREE.MeshBasicMaterial({ transparent: true, color: 0x000000, opacity: 0 })

        const boxOS = new THREE.Mesh(baseGeometry, baseMaterial)
        boxOS.rotation.y = rotateOS
        boxOS.position.x = 360
        boxOS.position.y = 50

        const boxOE = new THREE.Mesh(baseGeometry, baseMaterial)
        boxOE.position.x = 0
        boxOE.position.z = -360
        boxOE.position.y = 50

        const boxES = new THREE.Mesh(baseGeometry, baseMaterial)
        boxES.rotation.y = rotateES
        boxES.position.x = -360
        boxES.position.y = 50
    
        const fences_hitbox = [
            {
                name: "face_os",
                scene: boxOS,
                hitbox: new THREE.Box3().setFromObject(boxOS)
            },
            {
                name: "face_oe",
                scene: boxOE,
                hitbox: new THREE.Box3().setFromObject(boxOE)
            },
            {
                name: "face_es",
                scene: boxES,
                hitbox: new THREE.Box3().setFromObject(boxES)
            }
        ]

        scene.add(boxOS)
        scene.add(boxOE)
        scene.add(boxES)

        state.setState('models', [
            ...state.getState('models'),
            ...fences_hitbox
        ])

        state.setState('loaders', { ...state.getState('loaders'), ...{has_map_loaded: true }})
    }
}