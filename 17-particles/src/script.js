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
 const particleTexture = textureLoader.load('/textures/particles/11.png')
 
 
/**
 * Particles
 */
// const particlesGeometry = new THREE.SphereGeometry(1, 64, 64)
const particlesGeometry = new THREE.BufferGeometry()
const count = 5000
// each point is composed of 3 values (x, y, z)
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 5
  colors[i] = Math.random()
}
// create the buffer attribute specifying that each item is composed of 3 values
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const particlesMaterial = new THREE.PointsMaterial({
  // size of every particle
  size: 0.1,
  // render distant particles smaller than closer ones
  sizeAttenuation: true,
  // color: 0xff88cc,
  // map: particleTexture
  transparent: true,
  alphaMap: particleTexture,
  // using a small value means that the pixel will not be rendered if the transparency is 0
  // alphaTest: 0.001
  // test if what is being drawn is closer than what is already drawn
  // this could cause an object in the background being drawn as if it were above foreground objects
  // depthTest: false
  // tell that depth buffers for this material should not be written
  // depth buffers contain information about how deep objects are in the scene
  depthWrite: false,
  // add the color of overlapping pixels
  blending: THREE.AdditiveBlending,
  // enable different colors for different particles
  vertexColors: true
})
// create the particles points the same way we create meshes
// a particle will be created for each point in the geometry
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

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
camera.position.z = 3
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // particles.rotation.y = elapsedTime * 0.2
  for (let i = 0; i < count; i++) {
    const coordinateIndex = i * 3
    // used to add the same offset to the elements with the same x value
    const x = particlesGeometry.attributes.position.array[coordinateIndex]
 
    particlesGeometry.attributes.position.array[coordinateIndex + 1] = Math.sin(elapsedTime + x)
  }
  // signal that the position of the particles has changed
  particlesGeometry.attributes.position.needsUpdate = true

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
