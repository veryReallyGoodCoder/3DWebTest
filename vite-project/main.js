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


// GEOMETRY
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

//cube
const geometry = new THREE.BoxGeometry(1,1,1);
const mat1 = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
const cube = new THREE.Mesh(geometry, mat1);
scene.add(cube);

//planets
const planetGeometry = new THREE.SphereGeometry(5, 32, 32); // radius 5, smooth
const planetMaterial = new THREE.MeshBasicMaterial({ color: 0x3399ff , wireframe: false
});

// create the mesh
const planet = new THREE.Mesh(planetGeometry, planetMaterial);

// position it away from the cube
planet.position.set(-50, 10, 50);

// add a simple light to see the planet
const planetLight = new THREE.PointLight(0xffffff, 1, 200);
planetLight.position.set(30, 50, -50);
scene.add(planetLight);

// add the planet to the scene
scene.add(planet);

//stars

function createStars() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });

  const starVertices = [];
  for (let i = 0; i < 400; i++) {
    const x = THREE.MathUtils.randFloatSpread(1000);
    const y = THREE.MathUtils.randFloatSpread(1000);
    const z = THREE.MathUtils.randFloatSpread(1000);
    starVertices.push(x, y, z);
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

createStars();

/*function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 10, 10);
  const mat2 = new THREE.MeshBasicMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, mat2);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100 - 1000));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(400).fill().forEach(addStar);*/

//controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(20, 20, 20);

//orbit settings
controls.enableZoom = false;
controls.enablePan = false;

controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI;
controls.minAzimuthAngle = -Infinity;
controls.maxAzimuthAngle = Infinity;

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.target.copy(cube.position);

//let mouseX = 0;
//let mouseY = 0;

/*renderer.domElement.addEventListener('click', () =>{
  renderer.domElement.requestPointerLock();
});

document.addEventListener('mousemove', (event) => {
  if(document.pointerLockElement === renderer.domElement){
    mouseX += event.movementX * 0.0002;
    mouseY += event.movementY * 0.0002;

    mouseY = Math.max(-1, Math.min(1, mouseY));
  }
})

/*document.addEventListener('mousemove', function(event){
  mouseX = (event.clientX - window.innerWidth / 2) / window.innerWidth;
  mouseY = -(event.clientY - window.innerHeight / 2) / window.innerHeight;
});*/





//key events

const targetPos = new THREE.Vector3();

document.addEventListener("keydown", (keyEvent) => {
  const keyName = keyEvent.key;
  const speed = 0.5;

  if(keyName === "w"){
    console.log("W press");
    cube.position.y += speed;
    cube.lerp(cube.position, 5);
  }

  if(keyName === "s"){
    console.log("S press");
    cube.position.y -= speed;
    cube.lerp(cube.position, 5);
  }
  
})

//animate function
const clock = new THREE.Clock();

function animate(){
  requestAnimationFrame(animate);

  const delta = clock.getDelta(); 
  cube.rotation.x = (cube.rotation.x + delta * 0.1) % (Math.PI * 2);
  cube.rotation.y = (cube.rotation.y + delta * 0.1) % (Math.PI * 2);
  
  //cube.rotation.x += 0.0001;
  //cube.rotation.y += 0.0001;

  /*camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
  camera.position.y += (mouseY * 10 - camera.position.y) * 0.05;*/


  // cube.position.x += speed;

  //camera.set.position(cube.position.x + 20, cube.position.y + 20, cube.position.z + 20);

  controls.update();
  //camera.lookAt(cube.position);

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);