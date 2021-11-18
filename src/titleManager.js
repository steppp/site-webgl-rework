import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { gsap } from 'gsap'

/** @type {THREE.Scene} */
let targetScene = null
/** @type {THREE.Mesh} */
let titleMesh = new THREE.Mesh()
/** @type {THREE.Camera} */
let mainCamera = new THREE.Camera()

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

    // const font = await fontLoader.loadAsync('/fonts/droid_sans_bold.typeface.json')
    const font = fontLoader.load(
        '/fonts/droid_sans_bold.typeface.json',
        // bind the text parameter to the function call
        onFontLoaded.bind(this, text)
    )

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

/**
 * Set the position provider which should contain some methods to provide position values to update title mesh parameters
 * @param {Object} provider Object which provides position updates to use to compute some values for the title mesh
 */
const usingPositionProvider = (provider) => {
    // one should pass an instance of the mouse manager (or maybe just the onmousemouve callback?)
    // and then this function will use the updates to transform the title mesh

    let enterAnimation = null
    provider.addMouseMoveCallback(pos => {
        // TODO: avoid to store the animation in this, maybe store it in the provider object/pass it as an argument to this method?
        if (enterAnimation) {                    
            enterAnimation.kill()
            enterAnimation = gsap.to(titleMesh.rotation, {
                x: -0.4 - pos.y / 3, 
                y: pos.x / 7,
                duration: 0.2,
                onComplete: () => {
                    enterAnimation = null
                }
            })
            return
        }

        titleMesh.rotation.set(-0.4 - pos.y / 3, pos.x / 7, 0)
    })

    provider.addMouseLeaveCallback(pos => {
        console.log(pos)
    })

    provider.addMouseEnterCallback(pos => {
        console.log(pos)
    })
}

const titleBuilder = {
    forMainCamera,
    addTitle,
    usingPositionProvider
}

const titleManager = {
    forScene: (scene) => {
        targetScene = scene

        return titleBuilder
    }
}

export default titleManager