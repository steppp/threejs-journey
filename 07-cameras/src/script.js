import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Scene
const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
scene.background = new THREE.Color(0xffffff)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

const canvasElement = document.querySelector('canvas.webgl')
// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

const cursor = {
    x: 0,
    y: 0
}

const controls = new OrbitControls(camera, canvasElement)
controls.enableDamping = true
controls.rotateSpeed = 2
controls.zoomSpeed = 1.5
controls.panSpeed = 1.5
controls.dampingFactor = 0.1

const tick = () => {
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
    // camera.position.y = cursor.y * 3

    camera.lookAt(mesh.position)
    controls.update()

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

// canvasElement.addEventListener('pointermove', ev => {
//     cursor.x = ev.clientX / sizes.width - 0.5
//     cursor.y = -(ev.clientY / sizes.height - 0.5)
// });