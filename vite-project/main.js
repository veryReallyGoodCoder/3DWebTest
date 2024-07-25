//imports
import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { add } from 'three/examples/jsm/nodes/Nodes.js';


//scene setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

//controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 20, 20);



// geometry

const geometry = new THREE.BoxGeometry(1,1,1);
const mat1 = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, mat1);
scene.add(cube);

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const mat2 = new THREE.MeshBasicMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, mat2);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

function animate(){
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  controls.update();

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);