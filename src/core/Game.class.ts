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
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        const light = new THREE.AmbientLight(0xffffff); 
        const renderer = new THREE.WebGLRenderer();

        scene.background = new THREE.Color('black');
        scene.add(light);

        const controls = new OrbitControls( camera, renderer.domElement );

        controls.enablePan = false;
        controls.minPolarAngle = THREE.MathUtils.degToRad(45);
        controls.maxPolarAngle = THREE.MathUtils.degToRad(75);
        controls.minDistance = 10;
        controls.maxDistance = 30;
        controls.enableDamping = true;

        camera.position.set( 0, 20, 100 );

        renderer.setSize( window.innerWidth, window.innerHeight );

        this.window.document.body.appendChild( renderer.domElement );

        renderer.render(scene, camera)

        for (let key in properties)
            scene.add(properties[key].init())

        this.state.setState('document', {
            scene,
            camera,
            light,
            controls,
            renderer
        })
    }

    public async loadModels(models: Array<Model>) {
        const loader = new GLTFLoader();
        const scene = this.state.getState('document').scene

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