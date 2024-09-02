import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const light = new THREE.AmbientLight(0xffffff); 
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls( camera, renderer.domElement );

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 300).rotateX(-Math.PI * 0.5),
    new THREE.MeshBasicMaterial({
        color: new THREE.Color(0xC45B0F).multiplyScalar(1.5)
    })
);

scene.add(ground);

scene.background = new THREE.Color('black');

scene.add(light);

renderer.setSize( window.innerWidth, window.innerHeight );

controls.enablePan = false;
controls.minPolarAngle = THREE.MathUtils.degToRad(45);
controls.maxPolarAngle = THREE.MathUtils.degToRad(75);
controls.minDistance = 10;
controls.maxDistance = 30;
controls.enableDamping = true;

document.body.appendChild( renderer.domElement );

camera.position.set( 0, 20, 100 );

const loader = new GLTFLoader();

const loadModels = () => {
    return new Promise((res, rej) => {
        loader.load( '/slime.glb', res, undefined, rej);
    })
}

function animate() {
	requestAnimationFrame( animate );
    controls.update();
	renderer.render( scene, camera );
}

try {
    const gltf = await loadModels()

    console.log(gltf)

    scene.add(gltf.scene)

    animate();

} catch (err) {
    console.error(err)
}

