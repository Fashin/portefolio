import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import State from './State.class';
import Model from '../interface/Model.interface';

export default class Game {
    window: Window
    state: State

    constructor(window: Window, state: State) {
        this.window = window
        this.state = state
    }

    public init(properties: Array<any>): void {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const light = new THREE.AmbientLight(0xffffff); 
        const renderer = new THREE.WebGLRenderer();

        camera.position.set(0, 2, 5); // Position initiale de la caméra
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        scene.background = new THREE.Color('black');
        scene.add(light);

        renderer.setSize( window.innerWidth, window.innerHeight );

        this.window.document.body.appendChild( renderer.domElement );

        renderer.render(scene, camera)

        for (let key in properties)
            scene.add(properties[key].init())

        this.state.setState('document', {
            scene,
            camera,
            light,
            renderer
        })

        this.window.document.camera = camera
        this.window.document.renderer = renderer
        this.window.addEventListener('resize', this.onWindowResize);
    }

    public onWindowResize() {
        console.log('window resized !')
        window.document.camera.aspect = window.innerWidth / window.innerHeight;
        window.document.camera.updateProjectionMatrix();
        window.document.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public async loadModels(models: Array<Model>) {
        const loader = new GLTFLoader();
        const { scene } = this.state.getState('document')

        try {
            for (let key in models) {
                const model = await this.loadModel(loader, models[key].path)
                scene.add(model.scene)

                // TODO : peut être mettre le model complet, besoin des animations plus tard ?
                this.state.setState(models[key].key, model.scene)
            }
        } catch (err) {
            console.error(err)
        }
    }

    private loadModel(loader, modelPath): any {
        return new Promise((res, rej) => {
            loader.load(modelPath, res, undefined, rej);
        })
    }
}