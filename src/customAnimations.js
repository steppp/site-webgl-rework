import { gsap } from "gsap"
import * as THREE from "three"

/** @type {gsap.core.Tween} */
let initialAnimation
/** @type {Array.<gsap.core.Tween>} */
let forwardAnimationsStack = []
/** @type {gsap.core.Tween} */
let runningAnimation

/**
 * 
 * @param {Object} config Configuration object with references to the main mesh, the title mesh 
 * and an option object 
 * @param {THREE.Mesh} config.mainMesh Main scene mesh
 * @param {THREE.Mesh} config.titleMesh Mesh of the title in the scene
 * @param {Object} config.options Object with additional options to use to configure animations
 * @returns {gsap.core.Tween} Animation to be performed in a **paused** state
 */
const runInitialAnimation = ({mainMesh, titleMesh, options}) => {
    if (runningAnimation) {
        return
    }

    const { 
        duration = 1,
        easeType = 'expo.inOut',
        mainMeshScale = mainMesh.material.uniforms.uScale.value * 2,
        titleMeshPosition = new THREE.Vector3(0, 1.4, 0.5),
        paused = true,
    } = options

    // timeline which holds all the animations that have to run
    const animationTimeline = gsap.timeline({
        onStart: _ => {
            forwardAnimationsStack.push(animationTimeline)
        },
        onComplete: _ => {
            runningAnimation = null
        },
        onReverseComplete: _ => {
            forwardAnimationsStack.pop()
            runningAnimation = null
        },
    })

    // main mesh animation: scale it
    animationTimeline.to(mainMesh.material.uniforms.uScale, {
        value: mainMeshScale,
        ease: easeType,
        duration
    }, '<')

    // title animation: move it
    animationTimeline.to(titleMesh.position, {
        y: titleMeshPosition.y,
        z: titleMeshPosition.z,
        ease: easeType,
        duration,
    }, '<')

    runningAnimation = animationTimeline.paused(paused)
    return runningAnimation
}

const runInitialAnimationReversed = ({options}) => {
    if (runningAnimation) {
        return
    }

    const { paused } = options

    console.log(forwardAnimationsStack)
    const lastRanForwardAnimation = forwardAnimationsStack.pop()
    const reversedAnim = lastRanForwardAnimation?.reverse().paused(paused)
    runningAnimation = reversedAnim

    return reversedAnim
}

const customAnimations = {
    runInitialAnimation,
    runInitialAnimationReversed
}

export default customAnimations