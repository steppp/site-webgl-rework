import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import configuration from './configuration'
import { gsap } from 'gsap'

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(configuration.scene.background)

// Debug UI
const gui = new dat.GUI()
gui.addFolder('scene')
    .addColor(configuration.scene, 'background')
    .onChange(_ => scene.background.set(configuration.scene.background))

const mousePos = new THREE.Vector2()
window.addEventListener('mousemove', ev => {
    mousePos.x = ev.clientX / configuration.global.sizes.width * 2 - 1
    mousePos.y = - (ev.clientY / configuration.global.sizes.height) * 2 + 1
})

const axesHelper = new THREE.AxesHelper(1)
scene.add(axesHelper)

const sphereGeometry = new THREE.SphereGeometry(configuration.meshes.sphere.geometry.radius,
    configuration.meshes.sphere.geometry.segments, configuration.meshes.sphere.geometry.segments)
const particlesGeometry = new THREE.BufferGeometry()
const positions = sphereGeometry.getAttribute('position')
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions.array, positions.itemSize))
const particles = new THREE.Points(sphereGeometry, new THREE.PointsMaterial({
    size: configuration.meshes.particles.size,
    color: configuration.meshes.particles.color,
}));
scene.add(particles)

// Camera
const camera = new THREE.PerspectiveCamera(configuration.camera.fov, configuration.camera.aspectRatio)
camera.position.z = 2
scene.add(camera)

const canvasElement = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement
})
renderer.setSize(configuration.global.sizes.width, configuration.global.sizes.height)
// having a pixel ratio higher than 2 does not provide noticeable improvements while greatly affetcs performance
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.render(scene, camera)

// Controls
const controls = new OrbitControls(camera, canvasElement)
controls.enableDamping = true
controls.enabled = true

const tick = () => {
    controls.update()
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()

window.addEventListener('resize', () => {
    // update sizes
    configuration.global.sizes.width = window.innerWidth
    configuration.global.sizes.height = window.innerHeight

    // update camera's aspect ratio
    configuration.camera.aspectRatio = sizes.width / sizes.height
    camera.aspect = configuration.camera.aspectRatio
    // must be changed after changing the parameters
    camera.updateProjectionMatrix()

    renderer.setSize(configuration.global.sizes.width, configuration.global.sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})