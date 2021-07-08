import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'


// const image = new Image()
// const texture =  new THREE.Texture(image)
// image.addEventListener('load', () => {
//     // signal the texture element that it has to be reloaded since the image is ready
//     texture.needsUpdate = true
// })
// image.src = '/textures/door/color.jpg'
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => console.log('started loading')
loadingManager.onProgress = () => console.log('loading..')
loadingManager.onLoad = () => console.log('loaded')
loadingManager.onError = () => console.log('loading error')

const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('/textures/door/color.jpg')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// Scene
const scene = new THREE.Scene()

// const geometry = new THREE.BoxGeometry(1, 1, 1)
const geometry = new THREE.SphereGeometry(1, 32, 32)
// const geometry = new THREE.ConeGeometry(1, 1, 32)
// const geometry = new THREE.TorusGeometry(1, 0.35, 32, 100)
const material = new THREE.MeshBasicMaterial({ map: colorTexture })
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