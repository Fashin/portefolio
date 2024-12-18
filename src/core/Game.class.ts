import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/addons/objects/Water.js';
import { grassFragmentShader, grassVertexShader } from '../shader/grass';
import State from './State.class';
import Model from '../interface/Model.interface';

export default class Game {
    window: Window
    state: State

    constructor(window: Window, state: State) {
        this.window = window
        this.state = state
    }

    public init(): void {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();

        // Skybox
        const light = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1.5);
        light.color.setHSL( 0.6, 1, 0.6 );
        light.groundColor.setHSL( 0.095, 1, 0.75 );
        light.position.set( 0, 50, 0 );
        scene.add(light);

        scene.background = new THREE.TextureLoader().load('/materials/background.jpg')
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Water
        const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );
        const water = new Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load('/materials/waternormals.jpg', ( texture ) => {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7,
                fog: scene.fog !== undefined
            }
        );
        water.rotation.x = - Math.PI / 2
		scene.add(water)

        camera.position.set(0, 5, -10); // Position initiale de la caméra
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        
        renderer.setSize(window.innerWidth, window.innerHeight)

        this.window.document.body.appendChild(renderer.domElement)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableZoom = false
        controls.enablePan = false
        controls.minPolarAngle = 1
        controls.maxPolarAngle = 1
        controls.target.set(0, 41, -10)
        camera.position.set(0, 45, -20)

        this.state.setState('document', {
            scene,
            camera,
            light,
            renderer,
            controls,
            water
        })

        this.window.document.camera = camera
        this.window.document.renderer = renderer
        this.window.addEventListener('resize', this.onWindowResize)

        renderer.render(scene, camera)
    }

    public onWindowResize() {
        window.document.camera.aspect = window.innerWidth / window.innerHeight
        window.document.camera.updateProjectionMatrix()
        window.document.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    public async loadModels(models: Array<Model>) {
        const loader = new GLTFLoader()
        const { scene } = this.state.getState('document')
        const mixer = new THREE.AnimationMixer(scene)

        try {
            for (let key in models) {
                const model = await this.loadModel(loader, models[key].path)

                if (!models[key].hide)
                    scene.add(model.scene)

                if (models[key].scale) {
                    const scale = models[key].scale
                    model.scene.scale.set(scale[0], scale[1], scale[2])
                }

                if (models[key].animations) {
                    for (let i in models[key].animations) {
                        const animationConfig = models[key].animations[i]
                        const animation = model.animations.filter(a => a.name === animationConfig.name)

                        if (animation) {
                            const animationMixer = mixer.clipAction(animation[0], model.scene)

                            if (animationConfig.startOnLoad)
                                animationMixer.play()

                            this.state.setState(animationConfig.name + '_animation', animationMixer)
                        }
                    }
                }

                if (models[key].position) {
                    model.scene.position.x = models[key].position.x
                    model.scene.position.y = models[key].position.y
                    model.scene.position.z = models[key].position.z
                }

                if (models[key].castShadow)
                    model.scene.traverse(function (child) {
                        if (child.isMesh) {
                            child.castShadow = true
                            child.receiveShadow = true
                        }
                    })

                this.state.setState('models', [
                    ...this.state.getState('models', []),
                    {
                        name: models[key].name,
                        scene: model.scene,
                        hitbox: !models[key].hide ? new THREE.Box3().setFromObject(model.scene) : null,
                        config: models[key]
                    }
                ])
            }

            this.state.setState('mixer', mixer)
            this.state.setState('loaders', { models: true })
        } catch (err) {
            console.error(err)
        }
    }

    public hideLoader() {
        document.getElementById('loader-container').style.display = "none"

        this.state.setState('loaders', {...this.state.getState('loaders'), ...{ has_hide_loader: true }})
    }

    private loadModel(loader: GLTFLoader, modelPath: string): any {
        return new Promise((res, rej) => {
            loader.load(modelPath, res, undefined, rej);
        })
    }
}