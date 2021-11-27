import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { gsap } from 'gsap'

/** @type {THREE.Scene} */
let targetScene = null
/** @type {THREE.Mesh} */
let titleMesh = null
/** @type {THREE.Camera} */
let mainCamera = new THREE.Camera()
/** @type {gsap.core.Tween} */
let titleAnimation = null

/** @type {Promise<THREE.Mesh>} */
let titleCreatedPromise;

let onTitleCreated = () => {
    // perform operations on the title mesh such as setting properties ecc..
}

/**
 * Callback function to use after a font has been laoded using FontLoader.load
 * @param {string} text String to use as the title
 * @param {THREE.Font} font Loaded font instance
 */
const onFontLoaded = (text, font) => {
    const textGeometry = new TextGeometry(text, {
        font,
        size: 0.16,
        height: 0.04
    })
    const textSideMaterial = new THREE.MeshPhongMaterial({
        color: 0x65B891,
        // flatShading: true
    })
    const textFaceMaterial = new THREE.MeshPhongMaterial({
        color: 0x4E878C,
    })

    const textMesh = new THREE.Mesh(
        textGeometry, [textFaceMaterial, textSideMaterial]
    )
    textGeometry.center()
    // offset the text geometry to get a cool rotation effect
    textGeometry.translate(0, 0, -0.1)

    // TODO: check if the following two lines are actually needed
    textMesh.castShadow = true
    textMesh.receiveShadow = true

    targetScene.add(textMesh)
    titleMesh = textMesh

    textMesh.position.set(
        mainCamera.position.x * 0.6,
        1.2,
        mainCamera.position.z * 0.6
    )
    textMesh.lookAt(mainCamera.position)
}

/**
 * Adds a Mesh with a TextGeometry to be used as the title page to the target scene
 * @param {string} text Text to use as the title shown on the page
 * @returns Instance of the title builder, for easier call chaining
 */
const addTitle = (text) => {
    const fontLoader = new FontLoader()

    titleCreatedPromise = fontLoader.loadAsync('/fonts/droid_sans_bold.typeface.json')
        .then(font => {
            onFontLoaded(text, font)
            return new Promise((resolve, _) => resolve(titleMesh))
        })

    return titleBuilder
}

/**
 * Set the main camera to use to compute the mesh orientation and subsequent results
 * @param {THREE.Camera} camera THREE.Camera instance to use as the target camera for the title object
 * @returns Instance of the title builder, for easier call chaining
 */
const forMainCamera = (camera) => {
    mainCamera = camera
    return titleBuilder
}

const mouseMoveCallback = pos => {
    if (titleAnimation) {                    
        titleAnimation.kill()
        titleAnimation = gsap.to(titleMesh.rotation, {
            x: -0.4 - pos.y / 3, 
            y: pos.x / 7,
            duration: 0.2,
            onComplete: () => {
                titleAnimation = null
            }
        })
        return
    }

    titleMesh.rotation.set(-0.4 - pos.y / 3, pos.x / 7, 0)
}

const mouseEnterCallback = pos => {
    titleAnimation = gsap.to(titleMesh.rotation, {
        x: -0.4 - pos.y / 3,
        y: pos.x / 7,
        duration: 0.1,
    })
}

const mouseLeaveCallback = () => {
    // dummy mesh with same position of the title mesh to compute the rotation
    // to transition to using the lookAt() method
    const rotationHelperMesh = new THREE.Mesh(
        new THREE.BufferGeometry(),
        new THREE.Material())
    rotationHelperMesh.position.setFromMatrixPosition(titleMesh.matrix)
    targetScene.add(rotationHelperMesh)

    // rotate the dummy mesh
    rotationHelperMesh.lookAt(mainCamera.position)
    // use its new rotation value as the target value for the animation
    gsap.to(titleMesh.rotation, {
        x: rotationHelperMesh.rotation.x,
        y: rotationHelperMesh.rotation.y,
        z: rotationHelperMesh.rotation.z,
        duration: 0.2,
    })

    // remove the dummy mesh since it is no longer needed
    rotationHelperMesh.removeFromParent()
}

/**
 * Set the position provider which should contain some methods to provide position values to update title mesh parameters
 * @param {Object} provider Object which provides position updates to use to compute some values for the title mesh
 * @returns Instance of the title builder, for easier call chaining
 */
const usingPositionProvider = (provider) => {
    // one should pass an instance of the mouse manager (or maybe just the onmousemouve callback?)
    // and then this function will use the updates to transform the title mesh

    provider.addMouseMoveCallback(mouseMoveCallback)
    provider.addMouseLeaveCallback(mouseLeaveCallback)
    provider.addMouseEnterCallback(mouseEnterCallback)

    return titleBuilder
}

/**
 * Returns the main title mesh prommise
 * @returns Promise which completes when the title mesh has been instanciated
 */
const getBuildPromise = () => titleCreatedPromise

const titleBuilder = {
    forMainCamera,
    addTitle,
    usingPositionProvider,
    getBuildPromise
}

const titleManager = {
    forScene: (scene) => {
        targetScene = scene

        return titleBuilder
    }
}

export default titleManager