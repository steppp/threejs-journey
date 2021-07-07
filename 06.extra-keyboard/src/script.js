import './style.css'
import * as THREE from 'three'

// Scene
const scene = new THREE.Scene()

/**
 * Axes helper
 */
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl')
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

const tick = () => {
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

window.addEventListener('keydown', ev => {
    switch (ev.key) {
        case 'ArrowUp':
            mesh.position.y += 0.1
            break
        case 'ArrowDown':
            mesh.position.y -= 0.1
            break
        case 'ArrowRight':
            mesh.position.x += 0.1
            break
        case 'ArrowLeft':
            mesh.position.x -= 0.1
            break
        case ' ':
            camera.lookAt(mesh.position)
            break
        case 'w':
            camera.rotation.x += 0.05
            break
        case 's':
            camera.rotation.x -= 0.05
            break
        case 'a':
            camera.rotation.y += 0.05
            break
        case 'd':
            camera.rotation.y -= 0.05
            break
        default:
            break;
    }
});