import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

// Scene
const scene = new THREE.Scene()

/**
 * Debug
 */
const gui = new dat.GUI()

const textureLoader = new THREE.TextureLoader()
const matcapDonutsTexture = textureLoader.load('/textures/matcaps/3.png')
const matcapTextTexture = textureLoader.load('/textures/matcaps/5.png')

const fontLoader = new THREE.FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    font => {
        const textGeometry = new THREE.TextGeometry(
            'Hello THREE.js world',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 8,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0.01,
                bevelSegments: 2
            }
        )
        // calling this method will compute and set the value for the boundingBox property
        textGeometry.computeBoundingBox()
        // translate the geometry itself so it is centered in its mesh
        textGeometry.translate(
            - (textGeometry.boundingBox.max.x - 0.02) * 0.5,    // subtract bevel size
            - (textGeometry.boundingBox.max.y - 0.02) * 0.5,    // subtract bevel size
            - (textGeometry.boundingBox.max.z - 0.03) * 0.5     // subtract bevel thickness
        )

        // -.- or simply call
        // textGeometry.center()

        // the same material can be used for multiple meshes
        const textMaterial = new THREE.MeshMatcapMaterial({
            matcap: matcapTextTexture
        })
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)

        // the same geometry/material can be used for multiple meshes
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        const donutMaterial = new THREE.MeshMatcapMaterial({
            matcap: matcapDonutsTexture
        })

        for (let i = 0; i < 100; i++) {
            const donut = new THREE.Mesh(donutGeometry, donutMaterial)
            donut.geometry.computeBoundingBox()

            // do not add the donut if it overlaps with the text geometry
            // if (donut.geometry.boundingBox.intersectsBox(textGeometry.boundingBox)) {
            //     continue
            // } else {
            //     scene.add(donut)
            // }
            scene.add(donut)

            donut.position.x = (Math.random() - 0.5) * 6
            donut.position.y = (Math.random() - 0.5) * 6
            donut.position.z = (Math.random() - 0.5) * 6

            // torus is symmetric, half of a revolution is enough
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            // scale the donut using the same value for all the 3 axes to prevent deforming the shape
            const scale = Math.random()
            donut.scale.set(scale, scale, scale)
        }
    }
)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

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