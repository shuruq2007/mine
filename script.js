// 3D Talking Bear with Three.js

let scene, camera, renderer, bear, mouth, leftEye, rightEye, leftEar, rightEar;
let isTalking = false;
let mouthAnimation = null;

// Initialize Three.js scene
function init3DBear() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue
    
    // Add fog for depth
    scene.fog = new THREE.Fog(0x87CEEB, 10, 50);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, 
        document.getElementById('bearCanvas').clientWidth / 
        document.getElementById('bearCanvas').clientHeight, 
        0.1, 1000
    );
    camera.position.set(0, 2, 5);
    
    // Create renderer
    const canvas = document.getElementById('bearCanvas');
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Add forest background
    createForest();
    
    // Create bear
    createBear();
    
    // Add orbit controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2;
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}

// Create forest environment
function createForest() {
    // Add ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x228B22, // Forest green
        side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Add grass
    for (let i = 0; i < 50; i++) {
        const grassGeometry = new THREE.ConeGeometry(0.1, 0.5, 3);
        const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x32CD32 });
        const grass = new THREE.Mesh(grassGeometry, grassMaterial);
        grass.position.set(
            (Math.random() - 0.5) * 20,
            -0.75,
            (Math.random() - 0.5) * 20
        );
        grass.rotation.y = Math.random() * Math.PI * 2;
        scene.add(grass);
    }
    
    // Add trees
    for (let i = 0; i < 20; i++) {
        createTree(
            (Math.random() - 0.5) * 40,
            -1,
            (Math.random() - 0.5) * 40
        );
    }
    
    // Add flowers
    for (let i = 0; i; i < 30; i++) {
        const flowerGeometry = new THREE.CircleGeometry(0.2, 8);
        const flowerMaterial = new THREE.MeshLambertMaterial({ 
            color: Math.random() > 0.5 ? 0xFF69B4 : 0xFFD700 
        });
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
        flower.position.set(
            (Math.random() - 0.5) * 30,
            -0.8,
            (Math.random() - 0.5) * 30
        );
        flower.rotation.x = -Math.PI / 2;
        scene.add(flower);
    }
}

// Create a tree
function createTree(x, y, z) {
    // Tree trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 2, 8);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, y, z);
    trunk.castShadow = true;
    scene.add(trunk);
    
    // Tree leaves
    const leavesGeometry = new THREE.ConeGeometry(1.5, 3, 8);
    const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x2E8B57 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.set(x, y + 2, z);
    leaves.castShadow = true;
    scene.add(leaves);
}

// Create the bear
function createBear() {
    const bearGroup = new THREE.Group();
    
    // Bear body (brown sphere)
    const bodyGeometry = new THREE.SphereGeometry(1, 32, 32);
    const bodyMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x8B4513,
        shininess: 30
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    body.castShadow = true;
    bearGroup.add(body);
    
    // Bear head
    const headGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const headMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x8B4513,
        shininess: 30
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.8;
    head.castShadow = true;
    bearGroup.add(head);
    
    // Bear snout
    const snoutGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const snoutMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xD2691E,
        shininess: 30
    });
    const snout = new THREE.Mesh(snoutGeometry, snoutMaterial);
    snout.position.set(0, 1.8, 0.7);
    bearGroup.add(snout);
    
    // Bear mouth
    const mouthGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.1);
    const mouthMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x000000,
        shininess: 100
    });
    mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, 1.8, 1.05);
    bearGroup.add(mouth);
    
    // Bear nose
    const noseGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const noseMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x000000,
        shininess: 100
    });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0, 1.9, 1.1);
    bearGroup.add(nose);
    
    // Bear eyes
    const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const eyeMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x000000,
        shininess: 100
    });
    
    leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.25, 2, 0.9);
    bearGroup.add(leftEye);
    
    rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.25, 2, 0.9);
    bearGroup.add(rightEye);
    
    // Bear ears
    const earGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const earMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x8B4513,
        shininess: 30
    });
    
    leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(-0.4, 2.3, 0.5);
    bearGroup.add(leftEar);
    
    rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(0.4, 2.3, 0.5);
    bearGroup.add(rightEar);
    
    // Bear arms
    const armGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1, 8);
    const armMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x8B4513,
        shininess: 30
    });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.8, 0.5, 0);
    leftArm.rotation.z = Math.PI / 4;
    leftArm.castShadow = true;
    bearGroup.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.8, 0.5, 0);
    rightArm.rotation.z = -Math.PI / 4;
    rightArm.castShadow = true;
    bearGroup.add(rightArm);
    
    // Bear legs
    const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 8);
    const legMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x8B4513,
        shininess: 30
    });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.4, -0.4, 0);
    leftLeg.castShadow = true;
    bearGroup.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.4, -0.4, 0);
    rightLeg.castShadow = true;
    bearGroup.add(rightLeg);
    
    // Add bear to scene
    bear = bearGroup;
    scene.add(bear);
    
    // Add idle animation
    bear.userData.idleTime = 0;
}

// Make bear talk (animate mouth)
function makeBearTalk(duration = 2000) {
    if (isTalking) return;
    
    isTalking = true;
    document.querySelector('.bear-container').classList.add('talking');
    
    // Animate mouth
    let scale = 1;
    let direction = -0.1;
    
    mouthAnimation = setInterval(() => {
        scale += direction;
        if (scale < 0.3) direction = 0.1;
        if (scale > 1) direction = -0.1;
        mouth.scale.y = scale;
    }, 100);
    
    // Stop talking after duration
    setTimeout(() => {
        stopTalking();
    }, duration);
}

// Stop bear talking
function stopTalking() {
    if (!isTalking) return;
    
    isTalking = false;
    clearInterval(mouthAnimation);
    document.querySelector('.bear-container').classList.remove('talking');
    mouth.scale.y = 1;
}

// Make bear blink
function makeBearBlink() {
    leftEye.scale.y = 0.1;
    rightEye.scale.y = 0.1;
    
    setTimeout(() => {
        leftEye.scale.y = 1;
        rightEye.scale.y = 1;
    }, 200);
}

// Make bear dance
function makeBearDance() {
    const danceMovements = [
        { rotation: { x: 0, y: Math.PI/4, z: 0 } },
        { rotation: { x: 0, y: -Math.PI/4, z: 0 } },
        { position: { y: 0.5 } },
        { position: { y: 0 } },
        { rotation: { x: Math.PI/8, y: 0, z: 0 } },
        { rotation: { x: -Math.PI/8, y: 0, z: 0 } }
    ];
    
    let currentMove = 0;
    const danceInterval = setInterval(() => {
        const move = danceMovements[currentMove % danceMovements.length];
        
        if (move.rotation) {
            bear.rotation.x = move.rotation.x || 0;
            bear.rotation.y = move.rotation.y || 0;
            bear.rotation.z = move.rotation.z || 0;
        }
        
        if (move.position) {
            bear.position.y = move.position.y || 0;
        }
        
        currentMove++;
        
        // Also animate ears during dance
        leftEar.rotation.x = Math.sin(Date.now() * 0.01) * 0.5;
        rightEar.rotation.x = Math.cos(Date.now() * 0.01) * 0.5;
    }, 300);
    
    // Stop dancing after 5 seconds
    setTimeout(() => {
        clearInterval(danceInterval);
        bear.rotation.set(0, 0, 0);
        bear.position.y = 0;
        leftEar.rotation.x = 0;
        rightEar.rotation.x = 0;
    }, 5000);
}

// Make bear sleep
function makeBearSleep() {
    bear.rotation.x = Math.PI / 2;
    bear.position.y = -0.5;
    
    // Animate Zzz
    const zzzGeometry = new THREE.TextGeometry('Zzz', {
        font: new THREE.Font(/* You would need to load a font here */),
        size: 0.3,
        height: 0.1
    });
    // For simplicity, using cubes as Zzz
    for (let i = 0; i < 3; i++) {
        const zCube = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const zMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
        const zMesh = new THREE.Mesh(zCube, zMaterial);
        zMesh.position.set(i * 0.3, 2.5, 0);
        scene.add(zMesh);
        
        // Remove after animation
        setTimeout(() => scene.remove(zMesh), 3000);
    }
    
    // Wake up after 3 seconds
    setTimeout(() => {
        bear.rotation.x = 0;
        bear.position.y = 0;
    }, 3000);
}

// Handle window resize
function onWindowResize() {
    const canvas = document.getElementById('bearCanvas');
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Bear idle animation
    if (bear) {
        bear.userData.idleTime += 0.01;
        
        // Gentle swaying motion
        bear.rotation.y = Math.sin(bear.userData.idleTime * 0.5) * 0.05;
        bear.position.y = Math.sin(bear.userData.idleTime * 2) * 0.02;
        
        // Ear twitch occasionally
        if (Math.random() < 0.01) {
            leftEar.rotation.x = Math.random() * 0.5 - 0.25;
            rightEar.rotation.x = Math.random() * 0.5 - 0.25;
            
            setTimeout(() => {
                leftEar.rotation.x = 0;
                rightEar.rotation.x = 0;
            }, 200);
        }
        
        // Blink occasionally
        if (Math.random() < 0.005) {
            makeBearBlink();
        }
    }
    
    renderer.render(scene, camera);
}

// Initialize when page loads
window.addEventListener('load', () => {
    init3DBear();
    
    // Make bear say hello
    setTimeout(() => {
        makeBearTalk(3000);
    }, 1000);
});

// Export functions for use in other scripts
window.Bear3D = {
    talk: makeBearTalk,
    dance: makeBearDance,
    sleep: makeBearSleep,
    blink: makeBearBlink,
    stopTalking: stopTalking
};
