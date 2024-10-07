import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import State from './State.class';
import Model from '../interface/Model.interface';
import Setting from './Setting.class';

export default class Game extends Setting {
    window: Window
    state: State

    constructor(window: Window, state: State) {
        super(window)
        
        this.window = window
        this.state = state
    }

    public init(properties: Array<any>): void {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const light = new THREE.AmbientLight(0xffffff); 
        const renderer = new THREE.WebGLRenderer();

        camera.position.set(0, 5, -10); // Position initiale de la caméra
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        scene.background = new THREE.TextureLoader().load('/materials/background.jpg')
        scene.add(light);

        renderer.setSize(window.innerWidth, window.innerHeight);

        this.window.document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 1, 0);
        camera.position.set(0, 5, -10);

        this.state.setState('document', {
            scene,
            camera,
            light,
            renderer,
            controls
        })

        this.window.document.camera = camera
        this.window.document.renderer = renderer
        this.window.addEventListener('resize', this.onWindowResize);

        renderer.render(scene, camera)
    }

    public onWindowResize() {
        window.document.camera.aspect = window.innerWidth / window.innerHeight;
        window.document.camera.updateProjectionMatrix();
        window.document.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public async loadModels(models: Array<Model>) {
        const loader = new GLTFLoader();
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
                    const animation = mixer.clipAction(model.animations[0], model.scene)
                    this.state.setState(models[key].name + '_animation', animation)
                }

                if (models[key].position) {
                    model.scene.position.x = models[key].position.x
                    model.scene.position.y = models[key].position.y
                    model.scene.position.z = models[key].position.z
                }

                this.state.setState(models[key].name, model.scene)
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