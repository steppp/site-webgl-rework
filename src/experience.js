import configuration from './configuration'
import sizeManager from './sizeManager'
import helpersManager from './helpersManager'
import loggingManager from './loggingManager'
import * as THREE from 'three'
import particlesSystemManager from './particleSystemManager'
import { gsap } from 'gsap'

import particleVertexShader from './shaders/vertex.glsl'
import particleFragmentShader from './shaders/fragment.glsl'
import mouseManager from './mouseManager'
import guiManager from './guiManager'
import controls from './controls'
import titleManager from './titleManager'
import lightManager from './lightManager'
import customAnimations from './customAnimations'


const geometries = [
    {
        id: 'sphere',
        geom: new THREE.SphereGeometry(
            configuration.meshes.sphere.geometry.radius,
            configuration.meshes.sphere.geometry.segments,
            configuration.meshes.sphere.geometry.segments,
        )
    },
    {
        id: 'box',
        geom: new THREE.BoxGeometry(
            configuration.meshes.box.geometry.width,
            configuration.meshes.box.geometry.height,
            configuration.meshes.box.geometry.depth,
            configuration.meshes.box.geometry.segments,
            configuration.meshes.box.geometry.segments,
            configuration.meshes.box.geometry.segments,
        )
    },
    {
        id: 'torus',
        geom: new THREE.TorusGeometry(
            // TODO: add configuration items for these values
            0.5,
            0.3,
            256,
            256
        )
    },
]
const getNextGeometry = (() => {
    let i = -1
    const lengthMinOne = geometries.length - 1
    return () => {
        i += 1;
        // see /alternating_sequence_explain.txt
        const idx = (((i / lengthMinOne) & 1) * lengthMinOne) +
            ((i % lengthMinOne) * (1 - 2 * ((i / lengthMinOne) & 1)))
        return geometries[idx]
    }
})()

const init = (targetCanvas) => {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(configuration.scene.background)
    loggingManager.log('info', 'Scene built')

    const renderer = new THREE.WebGLRenderer({
        canvas: targetCanvas,
        powerPreference: 'high-performance'
    })
    renderer.setSize(sizeManager.sizes.width, sizeManager.sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    loggingManager.log('info', 'Renderer instanciated')

    return {
        renderer,
        scene
    }
}

const updateMesh = (scene) => {
    const geometry = getNextGeometry()
    loggingManager.log('info', 'Next geometry will be ', geometry)
    const mesh = particlesSystemManager.buildParticleSystem(geometry.geom)
    particlesSystemManager.updateSceneParticles(scene, mesh)

    return mesh;
}

const setupCamera = ({ scene, lookingAtPos }) => {
    const camera = new THREE.PerspectiveCamera(
        configuration.camera.fov,
        configuration.camera.aspectRatio,
        configuration.camera.near,
        configuration.camera.far
    )
    camera.position.set(
        configuration.camera.initialPosition.x,
        configuration.camera.initialPosition.y,
        configuration.camera.initialPosition.z
    )

    camera.lookAt(lookingAtPos)
    scene.add(camera)

    return camera
}

const setupScene = (scene) => {
    loggingManager.log('info', 'Running scene setup..')
    helpersManager.addAxesHelper(scene, configuration.scene.helpers.axes)

    particlesSystemManager.setup({
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader
    })

    const mainMesh = updateMesh(scene)
    const camera = setupCamera({
        scene,
        lookingAtPos: mainMesh.position
    })

    const titleBuildPromise = titleManager
        .forScene(scene)
        .forMainCamera(camera)
        // .addTitle(window.location.host.replace('www.', ''))
        .addTitle('SRAND.it')
        .usingPositionProvider(mouseManager)
        .getBuildPromise()

    lightManager.addLights({ scene })

    return { mainMesh, titleBuildPromise, camera }
}

const setupCustomHandlers = ({ renderer, camera }) => {
    const fov = configuration.camera.fov
    const sceneAspectRatio = 0.8

    sizeManager.setWindowResizeCallback(sizes => {
        camera.aspect
            = configuration.camera.aspectRatio
            = sizes.width / sizes.height

        // implement background-size: contains
        // see https://discourse.threejs.org/t/keeping-an-object-scaled-based-on-the-bounds-of-the-canvas-really-battling-to-explain-this-one/17574/10
        if (camera.aspect > sceneAspectRatio) {
            // window too large
            camera.fov = fov
        } else {
            // window too narrow
            const cameraHeight = Math.tan(THREE.MathUtils.degToRad(fov / 2))
            const ratio = camera.aspect / sceneAspectRatio
            const newCameraHeight = cameraHeight / ratio
            camera.fov = THREE.MathUtils.radToDeg(Math.atan(newCameraHeight)) * 2
        }
        camera.updateProjectionMatrix()

        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
}

const setupGui = () => {
    guiManager.createFolders([
        'scene', 'mesh', 'particles', 'actions'
    ])
}

const handleTitleBuiltPromise = (promise, mainMesh) => {
    promise.then(titleMesh => {
        const actionsObj = {
            initialAnimation: customAnimations.runInitialAnimation.bind(null, {
                mainMesh, titleMesh, options: {
                    paused: false,
                    mainMeshScale: mainMesh.material.uniforms.uScale.value * configuration.meshes.animationScale
                }
            }),
            initialAnimationReverse: customAnimations.runInitialAnimationReversed.bind(null, {
                options: {
                    paused: false
                }
            })
        }

        mouseManager.addMouseWheelCallback(ev => {
            if (ev.deltaY > 0) {
                customAnimations.runInitialAnimation({
                    mainMesh, 
                    titleMesh,
                    options: {
                        paused: false,
                        mainMeshScale: mainMesh.material.uniforms.uScale.value * configuration.meshes.animationScale    
                    }
                })
            } else {
                customAnimations.runInitialAnimationReversed({
                    options: {
                        paused: false
                    }
                })
            }
        });
        guiManager.addActionGui({
            targetObj: actionsObj,
            targetFuncName: 'initialAnimation',
            folderName: 'actions'
        })
        guiManager.addActionGui({
            targetObj: actionsObj,
            targetFuncName: 'initialAnimationReverse',
            folderName: 'actions'
        })
    })
}

const startRunLoop = ({ scene, mainMesh, renderer, camera, controls }) => {
    loggingManager.log('info', 'Starting run loop..')

    const clock = new THREE.Clock()
    let elapsedTime = 0

    const tick = () => {
        elapsedTime = clock.getElapsedTime()
        particlesSystemManager.updateMaterialUniforms({
            uRand: {
                value: Math.random()
            },
            uTime: {
                value: elapsedTime
            },
            uMousePos: {
                value: new THREE.Vector2(
                    mouseManager.mousePos.x,
                    mouseManager.mousePos.y
                )
            }
        })

        renderer.render(scene, camera)
        window.requestAnimationFrame(tick)

        controls.update()
    }

    tick()
}

const experience = (() => {
    return {
        run: (canvasElement) => {
            const { renderer, scene } = init(canvasElement)
            const { mainMesh, titleBuildPromise, camera } = setupScene(scene)

            setupCustomHandlers({ renderer, camera })
            const sceneControls = controls.buildControls({ camera, canvasElement })

            setupGui()
            handleTitleBuiltPromise(titleBuildPromise, mainMesh)

            renderer.render(scene, camera)
            startRunLoop({ scene, mainMesh, renderer, camera, controls: sceneControls })

            return { renderer, scene }
        }
    }
})()

export default experience;