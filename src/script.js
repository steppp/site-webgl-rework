import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CustomSceneBuilder } from './customSceneBuilder'
import { gsap } from 'gsap'

// Scene
const scene = new THREE.Scene()

// Debug UI
const gui = new dat.GUI()

// Custom Scene
const myScene = new CustomSceneBuilder(scene, {
    lights: false,
    shadows: true
}, gui)
myScene.addText('SRAND.it')
    .then(titleMesh => {
        gui.add(titleMesh.position, 'x')
            .min(-15)
            .max(30)
            .step(0.1)
            .name('title x pos')
        gui.add(titleMesh.position, 'y')
            .min(-15)
            .max(30)
            .step(0.1)
            .name('title y pos')
        gui.add(titleMesh.position, 'z')
            .min(-15)
            .max(30)
            .step(0.1)
            .name('title z pos')
        gui.add(titleMesh.rotation, 'x')
            .min(- Math.PI * 2)
            .max(Math.PI * 2)
            .step(0.1)
            .name('title x rot')
        gui.add(titleMesh.rotation, 'y')
            .min(- Math.PI * 2)
            .max(Math.PI * 2)
            .step(0.1)
            .name('title y rot')
        gui.add(titleMesh.rotation, 'z')
            .min(- Math.PI * 2)
            .max(Math.PI * 2)
            .step(0.1)
            .name('title z rot')
        // gui.add(titleMesh.geometry, 'bevelSize')
        //     .min(0)
        //     .max(5)
        //     .step(0.1)
        //     .name('title bevel size')
        // gui.add(titleMesh.geometry, 'bevelThickness')
        //     .min(0)
        //     .max(5)
        //     .step(0.1)
        //     .name('title bevel thickness')
    })

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

const subjectsRaycaster = new THREE.Raycaster()

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.x = 3.9
camera.position.y = 2
camera.position.z = 6.4
camera.lookAt(myScene.basePlaneMesh)
scene.add(camera)

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

const spotLightDirection = new THREE.Vector3()
THREE.Object3D.prototype.highlighted = false
THREE.Object3D.prototype.highlightedBy = null

const tick = () => {
    spotlightRaycaster.setFromCamera(mousePos, camera)
    const intersects = spotlightRaycaster.intersectObject(myScene.basePlaneMesh)
    if (intersects.length) {
        const planeTargetPoint = intersects[0].point
        myScene.secondaryLight.target.position.x = planeTargetPoint.x
        myScene.secondaryLight.target.position.y = planeTargetPoint.y
        myScene.secondaryLight.target.position.z = planeTargetPoint.z
    }

    myScene.secondaryLight.shadow.camera.getWorldDirection(spotLightDirection)
    subjectsRaycaster.set(myScene.secondaryLight.position, spotLightDirection)

    for (const subject of myScene.sceneSubjects) {
        const subjIntersects = subjectsRaycaster.intersectObject(subject, false)

        if (subjIntersects.length) {
            // the subject is crossed by the ray
            if (!subject.highlighted) {
                // previously not highlighted

                // not yet highlighted
                subject.highlighted = true
                subject.highlightedBy = myScene.secondaryLight

                // the intersected object actually should be a Mesh
                subject.material?.color.set(0x00ff00)
            }

            // else: already highlighted, do nothing
        } else {
            // the subject is not crossed by the ray
            if (subject.highlighted) {
                // previously highlighte
                subject.highlighted = false
                subject.highlightedBy = null
                subject.material?.color.set(0xff0000)
            }

            // else: still not highlighted, do nothing
        }
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