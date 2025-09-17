// Import Three.js and OrbitControls from CDN
const THREE = window.THREE;
const OrbitControls = window.OrbitControls;

// Main application
class DavidBustApp {
    constructor() {
        this.init();
        this.createBust();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        this.camera.position.y = 1.5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('renderCanvas'),
            antialias: true 
        });
        this.renderer.setSize(document.getElementById('canvas-container').offsetWidth, 
                            document.getElementById('canvas-container').offsetHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Add orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Add lights
        this.ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(this.ambientLight);
        
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directionalLight.position.set(1, 1, 1);
        this.scene.add(this.directionalLight);
        
        this.fillLight = new THREE.DirectionalLight(0x7777ff, 0.5);
        this.fillLight.position.set(-1, 0.5, -1);
        this.scene.add(this.fillLight);
        
        // Add subtle background effect
        this.addBackgroundEffects();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Auto rotation
        this.autoRotate = true;
    }
    
    createBust() {
        this.bust = new THREE.Group();
        
        // Head - using a sphere for the main part
        const headGeometry = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        headGeometry.scale(0.8, 1, 0.9);
        this.headMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xf0e6d2,
            roughness: 0.5,
            metalness: 0.2
        });
        const head = new THREE.Mesh(headGeometry, this.headMaterial);
        head.position.y = 0.5;
        this.bust.add(head);
        
        // Neck - using a cylinder
        const neckGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.6, 16);
        const neck = new THREE.Mesh(neckGeometry, this.headMaterial);
        neck.position.y = -0.3;
        this.bust.add(neck);
        
        // Shoulders - using a rounded cube
        const shouldersGeometry = new THREE.BoxGeometry(3, 1.2, 1.5, 4, 4, 4);
        shouldersGeometry.scale(1, 0.7, 0.8);
        const shoulders = new THREE.Mesh(shouldersGeometry, this.headMaterial);
        shoulders.position.y = -1.1;
        this.bust.add(shoulders);
        
        // Hair - using a custom shape
        const hairGeometry = new THREE.SphereGeometry(0.85, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        hairGeometry.scale(0.9, 0.5, 0.9);
        const hair = new THREE.Mesh(hairGeometry, new THREE.MeshBasicMaterial({
            color: 0x3a2a1d,
            roughness: 0.8,
            metalness: 0.1
        }));
        hair.position.y = 1.05;
        hair.position.z = 0.1;
        this.bust.add(hair);
        
        // Base for the bust
        const baseGeometry = new THREE.CylinderGeometry(1.8, 2, 0.4, 16);
        const base = new THREE.Mesh(baseGeometry, new THREE.MeshBasicMaterial({
            color: 0x555555,
            roughness: 0.3,
            metalness: 0.7
        }));
        base.position.y = -1.8;
        this.bust.add(base);
        
        // Pedestal
        const pedestalGeometry = new THREE.CylinderGeometry(2.5, 3, 0.8, 16);
        const pedestal = new THREE.Mesh(pedestalGeometry, new THREE.MeshMaterial({
            color: 0x333333,
            roughness: 0.4,
            metalness: 0.6
        }));
        pedestal.position.y = -2.4;
        this.bust.add(pedestal);
        
        this.scene.add(this.bust);
        
        // Remove loading screen
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
        }, 1500);
    }
    
    addBackgroundEffects() {
        // Add some floating particles in the background for visual interest
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 500;
        
        const posArray = new Float32Array(particleCount * 3);
        const colorArray = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 20;
            colorArray[i] = Math.random();
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        particlesMesh.position.z = -5;
        this.scene.add(particlesMesh);
    }
    
    setupEventListeners() {
        // Camera controls
        document.getElementById('cameraZoom').addEventListener('input', (e) => {
            this.camera.position.z = parseFloat(e.target.value);
        });
        
        document.getElementById('cameraHeight').addEventListener('input', (e) => {
            this.camera.position.y = parseFloat(e.target.value);
        });
        
        // Lighting controls
        document.getElementById('lightIntensity').addEventListener('input', (e) => {
            this.directionalLight.intensity = parseFloat(e.target.value);
        });
        
        document.getElementById('lightColor').addEventListener('input', (e) => {
            const temperature = parseFloat(e.target.value);
            const color = this.temperatureToColor(temperature);
            this.directionalLight.color.set(color);
        });
        
        // Material controls
        document.getElementById('materialRoughness').addEventListener('input', (e) => {
            this.headMaterial.roughness = parseFloat(e.target.value);
            this.headMaterial.needsUpdate = true;
        });
        
        document.getElementById('materialMetalness').addEventListener('input', (e) => {
            this.headMaterial.metalness = parseFloat(e.target.value);
            this.headMaterial.needsUpdate = true;
        });
        
        // Button controls
        document.getElementById('resetButton').addEventListener('click', () => {
            this.controls.reset();
        });
        
        document.getElementById('rotateToggle').addEventListener('click', () => {
            this.autoRotate = !this.autoRotate;
            document.getElementById('rotateToggle').textContent = 
                `Auto-Rotate: ${this.autoRotate ? 'On' : 'Off'}`;
        });
        
        // Double-click to reset
        this.renderer.domElement.addEventListener('dblclick', () => {
            this.controls.reset();
        });
    }
    
    temperatureToColor(temperature) {
        // Convert color temperature to RGB
        temperature /= 100;
        
        let red, green, blue;
        
        if (temperature <= 66) {
            red = 255;
        } else {
            red = temperature - 60;
            red = 329.698727446 * Math.pow(red, -0.1332047592);
            red = Math.max(0, Math.min(255, red));
        }
        
        if (temperature <= 66) {
            green = temperature;
            green = 99.4708025861 * Math.log(green) - 161.1195681661;
            green = Math.max(0, Math.min(255, green));
        } else {
            green = temperature - 60;
            green = 288.1221695283 * Math.pow(green, -0.0755148492);
            green = Math.max(0, Math.min(255, green));
        }
        
        if (temperature >= 66) {
            blue = 255;
        } else if (temperature <= 19) {
            blue = 0;
        } else {
            blue = temperature - 10;
            blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
            blue = Math.max(0, Math.min(255, blue));
        }
        
        return new THREE.Color(red/255, green/255, blue/255);
    }
    
    onWindowResize() {
        const container = document.getElementById('canvas-container');
        this.camera.aspect = container.offsetWidth / container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.autoRotate && !this.controls.isDragging) {
            this.bust.rotation.y += 0.002;
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the app when the page loads
window.addEventListener('load', () => {
    new DavidBustApp();
});