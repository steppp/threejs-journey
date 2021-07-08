import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'

const parameters = {
    color: 0xff0000,
    spin: () => {
        gsap.to(mesh.rotation, {
            duration: 1,
            y: mesh.rotation.y + Math.PI * 2
        })
    }
}

// DEBUG
const gui = new dat.GUI()

// Scene
const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5)
const material = new THREE.MeshBasicMaterial({ color: parameters.color })
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

gui.add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('elevation')
gui.add(mesh, 'visible')
gui.add(material, 'wireframe')
gui.addColor(parameters, 'color')
    .onChange(_ => {
        material.color.set(parameters.color)
    })
gui.add(parameters, 'spin')

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