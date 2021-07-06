console.log('Hello Three.js');
console.log(THREE);

/*
We need 4 elements to get started:

    A scene that will contain objects
    Some objects
    A camera
    A renderer
*/

// scene which will contain all the objects
const scene = new THREE.Scene();

// create a MESH: a combination of a geometry and a material
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

// add the mesh to the scene
scene.add(mesh);

// add the camera
// Field of View (FOV) = vertical vision angle
// Aspect Ratio = width of the canvas divided by his height
const sizes = {
    width: 800,
    height: 600
};

// create the camera passing the FOV and the aspect ratio
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// by default every object (camera included) is placed at the origin
// z is the depth axis, and its positive values are towards the user (exiting the screen)
camera.position.z = 3;
scene.add(camera);

// add the renderer
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });   // shorthand for { canvas: canvas }
// adjust the render size which in turns will automatically resize the canvas element too
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// now we can only see a square since the camera is orthogonal to the cube