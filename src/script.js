import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import configuration from './configuration'
import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import experience from './experience';
import sceneManager from './sceneManager'

const canvasElement = document.querySelector('canvas.webgl')
const { renderer, scene } = experience.run(canvasElement)

// gsap.registerPlugin(ScrollTrigger)


// const baseGeometry = new THREE.SphereGeometry(configuration.meshes.sphere.geometry.radius,
//     configuration.meshes.sphere.geometry.segments, configuration.meshes.sphere.geometry.segments)
// // const baseGeometry = new THREE.BoxGeometry(
// //     configuration.meshes.box.geometry.width, configuration.meshes.box.geometry.height, configuration.meshes.box.geometry.height,
// //     configuration.meshes.box.geometry.segments, configuration.meshes.box.geometry.segments, configuration.meshes.box.geometry.segments)
// // const baseGeometry = new THREE.TorusGeometry(
// //     0.5, 0.3, 256, 256
// // )

// sceneFolder
//     .add(configuration.scene.animations, 'rotationSpeed')
//     .min(-5)
//     .max(5)
//     .onFinishChange(_ => particles.material.uniforms.uRotationSpeed.value =
//         configuration.scene.animations.rotationSpeed)

// const meshFolder = gui.addFolder('mesh')
// meshFolder
//     .add(configuration.meshes.sphere.geometry, 'segments')
//     .min(16)
//     .max(512)
//     .onFinishChange(value => {
//         scene.remove(particles)
//         particles.material.dispose()
//         particles.geometry.dispose()
//         baseGeometry.dispose()

//         particles = buildParticleSystem(new THREE.SphereGeometry(
//             configuration.meshes.sphere.geometry.radius,
//             value,
//             value))
//         scene.add(particles)
//     })
// meshFolder
//     .add(configuration.meshes, 'scale')
//     .min(1)
//     .max(10)
//     .step(0.1)
//     .onChange(_ => particles.material.uniforms.uScale.value =
//         configuration.meshes.scale
//     )

// const particlesGuiFolder = gui.addFolder('particles')
// particlesGuiFolder
//     .addColor(configuration.meshes.particles, 'color')
//     .onChange(_ => particles.material.uniforms.uColor.value =
//         new THREE.Color(configuration.meshes.particles.color))

// particlesGuiFolder
//     .add(configuration.meshes.particles, 'size')
//     .min(1)
//     .max(8)
//     .onChange(_ => particles.material.uniforms.uUnadjustedPointSize.value =
//         configuration.meshes.particles.size * renderer.getPixelRatio())

// particlesGuiFolder
//         .add(configuration.meshes.particles.shaders, 'frequency')
//         .min(0)
//         .max(20)
//         .onChange(_ => particles.material.uniforms.uFrequency.value =
//             configuration.meshes.particles.shaders.frequency)

// particlesGuiFolder
//         .add(configuration.meshes.particles.shaders, 'speed')
//         .min(0)
//         .max(8)
//         .step(0.1)
//         .onChange(_ => particles.material.uniforms.uSpeed.value =
//             configuration.meshes.particles.shaders.speed)

// particlesGuiFolder
//         .add(configuration.meshes.particles.shaders, 'intensity')
//         .min(0)
//         .max(8)
//         .step(0.1)
//         .onChange(_ => particles.material.uniforms.uIntensity.value =
//             configuration.meshes.particles.shaders.intensity)

// const utilityFunctionsObject = (_ => {
//     const scaleAnimation = _ => gsap.to(particles.material.uniforms.uScale, {
//         value: configuration.meshes.scale * 2,
//         ease: 'expo.inOut',
//         duration: 2,
//         onComplete: _ => configuration.meshes.scale *= 2,
//         onReverseComplete: _ => configuration.meshes.scale /= 2,
//     })
//     let animationResult = null
//     return {
//         scaleAnimationForward: _ => animationResult = scaleAnimation(),
//         scaleAnimationBackwards: _ => animationResult?.reverse()
//     }
// })()

// const toggleAnimActionButtons = (toEnable, toDisable) => {
//     toEnable['__li'].style.pointerEvents = 'none'
//     toEnable['__li'].style.opacity = 0.5
//     toDisable['__li'].style.pointerEvents = 'all'
//     toDisable['__li'].style.opacity = 1
// }
// const actionsFolder = gui.addFolder('actions')
// const forwardAnimActionController = actionsFolder
//     .add(utilityFunctionsObject, 'scaleAnimationForward')
// const backwardsAnimActionController = actionsFolder
//     .add(utilityFunctionsObject, 'scaleAnimationBackwards')

// forwardAnimActionController.onFinishChange(_ => {
//     toggleAnimActionButtons(forwardAnimActionController, backwardsAnimActionController)
// })
// backwardsAnimActionController.onFinishChange(_ => {
//     toggleAnimActionButtons(backwardsAnimActionController, forwardAnimActionController)
// })

// // gsap.to(particles.material.uniforms.uScale, {
// //         value: configuration.meshes.scale * 2,
// //         ease: 'expo.inOut',
// //         duration: 2,
// //         onComplete: _ => configuration.meshes.scale *= 2,
// //         onReverseComplete: _ => configuration.meshes.scale /= 2,
// //     })

// sceneFolder
//     .add(configuration.scene.controls, 'enabled')
//     .name('Controls enabled')
//     .onFinishChange(_ => controls.enabled = configuration.scene.controls.enabled)
