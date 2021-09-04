import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CustomSceneBuilder } from './customSceneBuilder'

// Scene
const scene = new THREE.Scene()

// Debug UI
const gui = new dat.GUI()

// Custom Scene
const myScene = new CustomSceneBuilder(scene, {
    lights: false,
    shadows: true
}, gui)

gui.add(myScene.basePlaneMesh.position, 'x')
    .min(-15)
    .max(30)
    .step(0.1)
    .name('plane x')
gui.add(myScene.basePlaneMesh.position, 'y')
    .min(-15)
    .max(30)
    .step(0.1)
    .name('plane y')
gui.add(myScene.basePlaneMesh.position, 'z')
    .min(-15)
    .max(30)
    .step(0.1)
    .name('plane z')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const spotlightRaycaster = new THREE.Raycaster()
const mousePos = new THREE.Vector2()
window.addEventListener('mousemove', ev => {
    mousePos.x = ev.clientX / sizes.width * 2 - 1
    mousePos.y = - (ev.clientY / sizes.height) * 2 + 1
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.x = 3.9
camera.position.y = 2
camera.position.z = 6.4
camera.lookAt(myScene.basePlaneMesh)
scene.add(camera)

gui.add(camera.position, 'x')
    .min(-15)
    .max(30)
    .step(0.1)
    .name('camera x')
gui.add(camera.position, 'y')
    .min(-15)
    .max(30)
    .step(0.1)
    .name('camera y')
gui.add(camera.position, 'z')
    .min(-15)
    .max(30)
    .step(0.1)
    .name('camera z')

const canvasElement = document.querySelector('canvas.webgl')

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement
})
renderer.setSize(sizes.width, sizes.height)
// having a pixel ratio higher than 2 does not provide noticeable improvements while greatly affetcs performance
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// enable the generation of shadow maps
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

renderer.render(scene, camera)

// Controls
const controls = new OrbitControls(camera, canvasElement)
controls.enableDamping = true
controls.enabled = false

const tick = () => {
    spotlightRaycaster.setFromCamera(mousePos, camera)
    const intersects = spotlightRaycaster.intersectObject(myScene.basePlaneMesh)
    if (intersects.length) {
        const planeTargetPoint = intersects[0].point
        myScene.secondaryLight.target.position.x = planeTargetPoint.x
        myScene.secondaryLight.target.position.y = planeTargetPoint.y
        myScene.secondaryLight.target.position.z = planeTargetPoint.z
    }

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
    // must be changed after changing the parameters
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})