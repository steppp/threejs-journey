import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, -1)
directionalLight.castShadow = true
// increase the light's shadow map size to improve its quality
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
// as a regular camera, the shadow camera has near and far values
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
// control the camera amplitude
// directional light -> ortographic camera (objects keep the same size regardless of the distance)
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
// edit the shadow's blur
directionalLight.shadow.radius = 10
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(directionalLight)

// each light has a camera which is used to generate the shadow map
const directionalLightCameraHelper = new THREE.CameraHelper(
    directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)
directionalLightCameraHelper.visible = false

const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3)
spotLight.castShadow = true
spotLight.position.set(0, 2, 2)
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
// spotlight -> perspective camera
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6
scene.add(spotLight)
scene.add(spotLight.target)
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightCameraHelper)
spotLightCameraHelper.visible = false

const pointLight = new THREE.PointLight(0xffffff, 0.3)
pointLight.castShadow = true
pointLight.position.set(-1, 1, 0)
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5
scene.add(pointLight)
// pointlight -> perspective camera
// pointlight illuminates every direction, so THREE.js has to render each
// of the 6 directions to create a cube shadow map
// only the last direction's camera will be shown (downwards)
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
scene.add(pointLightCameraHelper)
pointLightCameraHelper.visible = false

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
// this object can cast a shadow
sphere.castShadow = true

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow
    })
)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5), 
    material
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.5
// this object can receive the shadow casted by some other object
plane.receiveShadow = true

sphereShadow.rotation.x = -Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01

scene.add(sphere, sphereShadow, plane)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// enable the generation of shadowmaps
renderer.shadowMap.enabled = false
// this type of render provides better results but it is computationally
// more expensive and does not support blurred shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  sphere.position.x = Math.cos(elapsedTime) * 1.5
  sphere.position.z = Math.sin(elapsedTime) * 1.5
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

  sphereShadow.position.x = sphere.position.x
  sphereShadow.position.z = sphere.position.z
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.6

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()