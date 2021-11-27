import { gsap } from "gsap"
import * as THREE from "three"

/** @type {gsap.core.Tween} */
let initialAnimation

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
    const { 
        duration = 1,
        easeType = 'expo.inOut',
        mainMeshScale = mainMesh.material.uniforms.uScale.value * 2,
        titleMeshPosition = new THREE.Vector3(0, 1.4, 0.5),
        paused = true,
    } = options

    // timeline which holds all the animations that have to run
    const animationTimeline = gsap.timeline()

    // main mesh animation: scale it
    animationTimeline.to(mainMesh.material.uniforms.uScale, {
        value: mainMeshScale,
        ease: easeType,
        duration,
    }, '<')
    // title animation: move it

    animationTimeline.to(titleMesh.position, {
        y: titleMeshPosition.y,
        z: titleMeshPosition.z,
        ease: easeType,
        duration,
    }, '<')

    initialAnimation = animationTimeline.paused(paused)
    return initialAnimation
}

const runInitialAnimationReversed = ({options}) => {
    const { paused } = options

    initialAnimation?.reverse().paused(paused)
}

const customAnimations = {
    runInitialAnimation,
    runInitialAnimationReversed
}

export default customAnimations