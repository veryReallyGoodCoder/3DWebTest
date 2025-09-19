//imports
import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { add } from 'three/examples/jsm/nodes/Nodes.js';
import { LatheGeometry } from 'three';


//scene setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);


// GEOMETRY

//grid
//const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(gridHelper);

//cube
const geometry = new THREE.BoxGeometry(1,1,1);
const mat1 = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
const cube = new THREE.Mesh(geometry, mat1);
scene.add(cube);

//planets
const planetGeometry = new THREE.SphereGeometry(5, 32, 32); 
const planetMaterial = new THREE.MeshBasicMaterial({ color: 0x3399ff});
const planet = new THREE.Mesh(planetGeometry, planetMaterial);

planet.position.set(-50, 10, 250);

// add a simple light to see the planet
/*const planetLight = new THREE.PointLight(0xffffff, 1, 200);
planetLight.position.set(30, 50, -50);
scene.add(planetLight);*/

// add the planet to the scene
scene.add(planet);

//torus knot
const tGeometry = new THREE.TorusKnotGeometry (5, 1, 80, 8);
const tMat = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true } );
const torusKnot = new THREE.Mesh(tGeometry, tMat);
torusKnot.position.set(50, 20, 10);

scene.add(torusKnot);

//David
/*function createDavidBust() {
  // profile curve (x = radius, y = height)
  const pts = [
    new THREE.Vector2(0.0, 0.0),   // center bottom (base)
    new THREE.Vector2(2.8, 0.0),   // chest
    new THREE.Vector2(3.5, 1.5),   // shoulders
    new THREE.Vector2(2.6, 3.5),   // narrowing into neck base
    new THREE.Vector2(1.8, 5.0),   // neck
    new THREE.Vector2(2.0, 6.5),   // jaw
    new THREE.Vector2(1.5, 7.5),   // chin area
    new THREE.Vector2(1.4, 8.4),   // mouth level
    new THREE.Vector2(1.6, 9.2),   // nose level (slight bulge)
    new THREE.Vector2(1.3, 10.2),  // eyes/brow line
    new THREE.Vector2(2.0, 11.5),  // hair mass outward
    new THREE.Vector2(2.6, 12.2),  // crown of hair
    new THREE.Vector2(1.2, 13.0),  // taper top inward
    new THREE.Vector2(0.0, 13.4)   // close at top
  ];

  const bustGeo = new LatheGeometry(pts, 96); // smoother segments
  bustGeo.computeVertexNormals();

  const bustMat = new THREE.MeshStandardMaterial({
    color: 0xf0f0f0,        // marble-like white
    roughness: 0.55,
    metalness: 0.05,
    flatShading: false
  });

  const bustMesh = new THREE.Mesh(bustGeo, bustMat);
  bustMesh.name = "davidBust";
  bustMesh.position.set(-10, 0, -20);
  bustMesh.scale.set(1.2, 1.2, 1.2);
  bustMesh.castShadow = true;
  bustMesh.receiveShadow = true;

  return bustMesh;
}

const davidBust = createDavidBust();
scene.add(davidBust);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
rimLight.position.set(-20, 30, -15);
scene.add(rimLight);

const fillLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(fillLight);

// optional: gentle rotation to show the bust (or handle in animate loop)
davidBust.rotation.z = 0; // leave static if you prefer
*/

//David new

function createBust(){
  const bust = new THREE.Group();

  const headGeometry = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
  headGeometry.scale(.8, 1, .9);
  const headMaterial = new THREE.MeshBasicMaterial({color: 0x61223b, roughness: 0.5, metalness: 0.2});
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 0.5;
  bust.add(head);

  const neckGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.6, 16);
  const neck = new THREE.Mesh(neckGeometry, headMaterial);
  neck.position.y = -0.3;
  bust.add(neck);

  const shouldersGeometry = new THREE.BoxGeometry(3, 1.2, 1.5, 4, 4, 4);
  shouldersGeometry.scale(1, 0.7, 0.8);
  const shoulders = new THREE.Mesh(shouldersGeometry, headMaterial);
  shoulders.position.y = -1.1;
  bust.add(shoulders);

  const hairGeometry = new THREE.SphereGeometry(0.85, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
  hairGeometry.scale(0.9, 0.5, 0.9);
  const hair = new THREE.Mesh(hairGeometry, new THREE.MeshBasicMaterial({
    color: 0xffff00,
    roughness: 0.8,
    metalness: 0.1
  }));
  hair.position.y = 1.005;
  hair.position.z = 0.1;
  bust.add(hair);

  const baseGeometry = new THREE.CylinderGeometry(1.8, 2, 0.4, 16);
  const base = new THREE.Mesh(baseGeometry, new THREE.MeshBasicMaterial({
    color: 0x555555,
    roughness: 0.3,
    metalness: 0.7
  }));
  base.position.y = -1.8;
  bust.add(base);

  const pedestalGeometry = new THREE.CylinderGeometry(2.5, 3, 0.8, 16);
  const pedestal = new THREE.Mesh(pedestalGeometry, new THREE.MeshBasicMaterial({
            color: 0x333333,
            roughness: 0.4,
            metalness: 0.6
        }));
        pedestal.position.y = -2.4;
        bust.add(pedestal);

  scene.add(bust);
}

createBust();

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

function createConstellations() {
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1.2 });
  const constellationGroup = new THREE.Group();

  // Example constellations (simple approximations in 3D space)
  const constellations = {
    "Orion": [
      [0, 0, 0], [10, 15, 0], [20, 0, 0], [5, -15, 0], [15, -15, 0], [25, -5, 0]
    ],
    "Ursa Major": [
      [0, 0, 0], [10, 5, 0], [20, 10, 0], [30, 15, 0],
      [25, 25, 0], [15, 20, 0], [5, 15, 0]
    ],
    "Cassiopeia": [
      [0, 0, 0], [10, 5, 0], [20, -5, 0], [30, 10, 0], [40, 0, 0]
    ]
  };

  Object.entries(constellations).forEach(([name, coords], index) => {
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    const starsArray = [];

    // Offset each constellation so they're spread out in the sky
    const offsetX = THREE.MathUtils.randFloatSpread(800);
    const offsetY = THREE.MathUtils.randFloatSpread(800);
    const offsetZ = THREE.MathUtils.randFloatSpread(800);

    coords.forEach(([x, y, z]) => {
      const px = x + offsetX;
      const py = y + offsetY;
      const pz = z + offsetZ;
      starVertices.push(px, py, pz);
      starsArray.push(new THREE.Vector3(px, py, pz));
    });

    // Add stars
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    constellationGroup.add(stars);

    // Add connecting lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.8 });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(starsArray);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    constellationGroup.add(line);
  });

  scene.add(constellationGroup);
}

// Call instead of createStars()
createConstellations();


createConstellations();

function createNebulae() {
  const nebulaGroup = new THREE.Group();

  // Create a radial gradient texture for the nebula
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
  gradient.addColorStop(0, "rgba(255, 150, 200, 0.8)"); // bright core
  gradient.addColorStop(0.5, "rgba(100, 50, 150, 0.5)"); // mid tones
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // fade out
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const nebulaTexture = new THREE.CanvasTexture(canvas);

  // Generate 3 nebulae
  for (let i = 0; i < 3; i++) {
    const material = new THREE.SpriteMaterial({
      map: nebulaTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const nebula = new THREE.Sprite(material);

    nebula.position.set(
      THREE.MathUtils.randFloatSpread(6000),
      THREE.MathUtils.randFloatSpread(6000),
      THREE.MathUtils.randFloatSpread(6000)
    );

    const scale = THREE.MathUtils.randFloat(400, 800);
    nebula.scale.set(scale, scale, 1);

    nebulaGroup.add(nebula);
  }

  scene.add(nebulaGroup);
}

createNebulae();


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


//click events
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  // normalize mouse coords (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const planetIntersects = raycaster.intersectObject(planet, true);

  if (planetIntersects.length > 0) {
    window.location.href = "/HTML/about.html";
  }

  const torusIntersects = raycaster.intersectObject(torusKnot, true);
  if(torusIntersects.length > 0){
    window.location.href = "/HTML/gallery.html";
  }

}

window.addEventListener('click', onMouseClick);


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
  

  torusKnot.rotation.y = (torusKnot.rotation.y + delta * 0.5) % (Math.PI * 2);
  torusKnot.rotation.z = (torusKnot.rotation.z + delta * 0.5) % (Math.PI * 2);

  planet.position.applyAxisAngle(new THREE.Vector3(0,1,0), 0.00001);

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