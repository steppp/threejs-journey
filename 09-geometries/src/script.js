import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Scene
const scene = new THREE.Scene()

// const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5)
// const geometry = new THREE.SphereGeometry(1, 32, 32)
const geometry = new THREE.BufferGeometry();
// const positionsArray = new Float32Array([
// //  x, y, z
//     0, 0, 0,    // first vertex
//     0, 1, 0,    // second vertex
//     1, 0, 0     // third vertex
// ])
const trianglesCount = 10
const positionsArray = new Float32Array(trianglesCount * 3 * 3)
for (let i = 0; i < trianglesCount * 3 * 3; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 4
}
// create an attribute with the just defined values and tell that each vertex is described by 3 values (x, y, z)
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)

const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
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
// limit the pixel ratio to 2 since grater values do not improve image quality by a large margin
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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

    controls.update()

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

window.addEventListener('resize', () => {
    // update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // update camera's aspect ratio
    camera.aspect = sizes.width / sizes.height

    camera.updateProjectionMatrix()

    // update the renderer: automatically update canvas width and height
    renderer.setSize(sizes.width, sizes.height)
})

window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(canvasElement.requestFullscreen)
        {
            canvasElement.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvasElement.webkitRequestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})