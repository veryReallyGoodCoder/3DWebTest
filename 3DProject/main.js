import './style.css'
import * as THREE from 'three'

const scene = new THREE.Scene();

const cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();

// renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// cam.position.setZ(30);

renderer.render(scene, cam);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const mat = new THREE.MeshBasicMaterial({
  color: 0xFF6347, 
  wireframe: true
});

const torus = new THREE.Mesh(geometry, mat);

scene.add(torus); 

function animate(){
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;

  renderer.render(scene, cam);
}

animate();
window.print();