import './style.css'
import * as THREE from 'three'
import { Vector3 } from 'three';

// Scene
const scene = new THREE.Scene()

/**
 * Axes helper
 */
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

const group = new THREE.Group()
group.scale.y = 2
group.rotation.y = 0.2
scene.add(group)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
mesh.position.x = -1.5
group.add(mesh)

const mesh1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff11 })
)
mesh1.position.x = 0
group.add(mesh1)

const mesh2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
mesh2.position.x = 1.5
group.add(mesh2)

mesh2.position.z = 1
group.add(mesh2)

// mesh.position.set(1, -1, -1)
// console.log(mesh.position)
// console.log(mesh.position.length())
// console.log(mesh.position.normalize())
// console.log(mesh.position.normalize().length())

// mesh.scale.x = 2
// mesh.scale.y = 0.7

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)
console.log(mesh.position.distanceTo(camera.position))

// camera.lookAt(new Vector3(1, -1, -1));

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl')
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
