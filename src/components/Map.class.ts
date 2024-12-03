import * as THREE from 'three';
import State from '../core/State.class';
import { projects } from '../config/projects';
import { cover } from 'three/src/extras/TextureUtils.js';

export default class Map {
    public constructor(state: State) {
        const { scene } = state.getState('document')

        // generate ground
        // const groundTexture = new THREE.TextureLoader().load('/materials/ground.png')
        // const roadTexture = new THREE.TextureLoader().load('/materials/road.jpg')
        // const parquetTexture = new THREE.TextureLoader().load('/materials/parquet.png')
        // const goldTexture = new THREE.TextureLoader().load('/materials/gold.png')

        // for (let i = -400; i < 400; i += 20) {
        //     for (let j = -400; j < 400; j += 20) {
        //         const ground = new THREE.Mesh(
        //             new THREE.PlaneGeometry(20, 20).rotateX(-Math.PI * 0.5),
        //             new THREE.MeshBasicMaterial({
        //                 map: i > -40 && i < 40 ? roadTexture : groundTexture,
        //                 reflectivity: 0
        //             })
        //         );

        //         ground.position.x = i
        //         ground.position.z = j

        //         scene.add(ground)
        //     }
        // }

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

        scene.add(boxOS)
        scene.add(boxOE)
        scene.add(boxES)
    
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

        //hitbox for teleport
        const tpGeometry = new THREE.BoxGeometry(80, 100)
        const tpMaterial = new THREE.MeshBasicMaterial({ transparent: true, color: 0x000000, opacity: 0 })
        const boxTP = new THREE.Mesh(tpGeometry, tpMaterial)
        boxTP.position.z = 140

        scene.add(boxTP)

        // ground for interior of museum
        for (let i = 0; i < 400; i += 10) {
            for (let j = 0; j < 80; j += 10) {
                const interiorGround =  new THREE.Mesh(
                    new THREE.PlaneGeometry(10, 10).rotateX(-Math.PI * 0.5),
                    new THREE.MeshBasicMaterial({
                        map: parquetTexture
                    })
                )

                interiorGround.position.x = j
                interiorGround.position.z = 1000 + i

                scene.add(interiorGround)
            }
        }

        // wall for interior of museum
        let wall_hitboxs: Array<any> = []
        const wallTexture = new THREE.TextureLoader().load('/materials/marble.png')
        wallTexture.repeat.set(10, 10)
        wallTexture.wrapS = THREE.RepeatWrapping
        wallTexture.wrapT = THREE.RepeatWrapping 

        const wallMaterial = new THREE.MeshBasicMaterial({ map: wallTexture })
        const wallGeometry = new THREE.BoxGeometry(80, 50)

        for (let i = 1040; i < 1400; i += 80) {
            const ouestWall = new THREE.Mesh(wallGeometry, wallMaterial)
            const estWall = new THREE.Mesh(wallGeometry, wallMaterial)

            ouestWall.position.x = 75
            ouestWall.position.y = 25
            ouestWall.position.z = i
            ouestWall.rotation.y = Math.PI / 2

            estWall.position.x = -5
            estWall.position.y = 25
            estWall.position.z = i
            estWall.rotation.y = Math.PI / 2

            wall_hitboxs = [
                ...wall_hitboxs,
                {
                    name: 'wall_o_' + i,
                    scene: ouestWall,
                    hitbox: new THREE.Box3().setFromObject(ouestWall)
                },
                {
                    name: 'wall_e_' + i,
                    scene: estWall,
                    hitbox: new THREE.Box3().setFromObject(estWall)
                }
            ]
            scene.add(ouestWall)
            scene.add(estWall)
        }
        
        const southWall = new THREE.Mesh(wallGeometry, wallMaterial)
        const northWall = new THREE.Mesh(wallGeometry, wallMaterial)

        southWall.position.x = 35
        southWall.position.y = 25
        southWall.position.z = 1000

        northWall.position.x = 35
        northWall.position.y = 25
        northWall.position.z = 1390

        wall_hitboxs = [
            ...wall_hitboxs,
            {
                name: 'wall_s',
                scene: southWall,
                hitbox: new THREE.Box3().setFromObject(southWall)
            },
            {
                name: 'wall_n',
                scene: northWall,
                hitbox: new THREE.Box3().setFromObject(northWall)
            }
        ]
        
        scene.add(southWall)
        scene.add(northWall)

        // paint for interior of museum
        const paint = state.getModel('paint').scene
        

        let labels: Array<any> = []

        for (let i in projects) {
            const labelMaterial = new THREE.MeshBasicMaterial({ map: goldTexture })
            const labelGeometry = new THREE.BoxGeometry(3, 1, 0.2)
            const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial)

            const isRight = i % 2 === 0
            const { nPaint, nLabel } = this.addNewPaint(
                paint.clone(),
                labelMesh,
                isRight,
                isRight ? 75 : -5,
                1050 + (i * 20),
                isRight ? Math.PI / 2 : -Math.PI / 2,
                isRight ? Math.PI : false,
                projects[i]
            )

            labels.push({
                name: 'label_' + i,
                scene: nLabel,
                project: projects[i]
            })

            scene.add(nLabel)
            scene.add(nPaint)
        }

        state.setState('models', [
            ...state.getState('models'),
            ...fences_hitbox,
            ...wall_hitboxs,
            ...labels,
            {
                name: 'teleport',
                scene: boxTP,
                hitbox: new THREE.Box3().setFromObject(boxTP)
            }
        ])

        state.setState('loaders', { ...state.getState('loaders'), ...{has_map_loaded: true }})
    }

    private addNewPaint(nPaint, nLabel, isRight, x, z, pRotateZ, tRotate, project) {
        const nPaintMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(project.picture, tex => {
                tex.center = new THREE.Vector2(.5, .5)
                tex.repeat.set(2, 2);
                tex.rotation = tRotate
                tex.needsUpdate = true;
            })
        })
        
        nPaint.position.x = x
        nPaint.position.y = 5
        nPaint.position.z = z
        nPaint.rotation.z = pRotateZ

        nLabel.position.x = isRight ? x - 1 : x + 1
        nLabel.position.y = 5
        nLabel.position.z = z + 8
        nLabel.rotation.y = pRotateZ

        nPaint.traverse(obj => {
            if (obj.isMesh && obj.material.name === "painting") {
                obj.material = nPaintMaterial
            }
        })

        return {
            nPaint,
            nLabel
        }
    }
}