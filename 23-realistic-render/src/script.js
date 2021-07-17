import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {
  envMapIntensity: 5
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// environment map
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg'
])
// all textures which can be seen directly (i.e. map) should have THREE.sRGBEncoding
// all the others (i.e. normalMap) should have THREE.LinearEncoding
environmentMap.encoding = THREE.sRGBEncoding
// set the environment map as the scene background
// alternatively we could create a cube with visible internal faces and apply the texture
scene.background = environmentMap

/**
 * Update all materials in an object:
 * - set the environment map
 */
const updateAllMaterials = () => {
  scene.traverse(child => {
    // only care about standard materials
    if (child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial) {
      child.material.envMap = environmentMap
      child.material.envMapIntensity = debugObject.envMapIntensity
      child.material.needsUpdate = true
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}
gui.add(debugObject, 'envMapIntensity')
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterials)

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load(
  // '/models/FlightHelmet/glTF/FlightHelmet.gltf',
  '/models/hamburger.glb',
  (gltf) => {
    gltf.scene.scale.set(0.3, 0.3, 0.3)
    gltf.scene.position.set(0, -1, 0)
    // gltf.scene.rotation.y = Math.PI * 0.5
    scene.add(gltf.scene)

    updateAllMaterials()

    gui.add(gltf.scene.rotation, 'y')
      .min(-Math.PI)
      .max(Math.PI)
      .step(0.001)
      .name('rotation')
  }
)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(0.25, 3, -2.25)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
// combat 'shadow acne', a phenomenon that cause surfaces to cast
// and receive shadows on themselves
directionalLight.shadow.normalBias = 0.05
scene.add(directionalLight)

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

gui.add(directionalLight, 'intensity')
  .min(0)
  .max(10)
  .step(0.001)
  .name('lightIntensity')
gui.add(directionalLight.position, 'x')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('lightX')
gui.add(directionalLight.position, 'y')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('lightY')
gui.add(directionalLight.position, 'z')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('lightZ')
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
camera.position.set(4, 1, -4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true // use MSAA
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
// tone mapping tipically used to convert HDR values to LDR ones
// even tho our assets are not HDR, the tone mapping can provide a realistic result
renderer.toneMapping = THREE.ReinhardToneMapping
gui.add(renderer, 'toneMapping', {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping
})
// dat.gui treats the number values as strings
// while the renderer.toneMapping property has type Number
.onFinishChange(value => {
  renderer.toneMapping = Number(value)
  updateAllMaterials()
})

renderer.toneMappingExposure = 3
gui.add(renderer, 'toneMappingExposure')
  .min(0)
  .max(10)
  .step(0.001)

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
