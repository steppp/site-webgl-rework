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

    titleManager
        .forScene(scene)
        .forMainCamera(camera)
        // .addTitle(window.location.host.replace('www.', ''))
        .addTitle('SRAND.it')
        .usingPositionProvider(mouseManager)

    lightManager.addLights({ scene })

    return { mainMesh, camera }
}

const setupCustomHandlers = ({ renderer, camera }) => {
    sizeManager.setWindowResizeCallback(sizes => {
        camera.aspect
            = configuration.camera.aspectRatio
            = sizes.width / sizes.height
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

const startRunLoop = ({scene, mainMesh, renderer, camera, controls}) => {
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
            const { mainMesh, camera } = setupScene(scene)
            setupCustomHandlers({ renderer, camera })
            setupGui()
            const sceneControls = controls.buildControls({ camera, canvasElement })

            renderer.render(scene, camera)
            startRunLoop({ scene, mainMesh, renderer, camera, controls: sceneControls })

            return { renderer, scene }
        }
    }
})()

export default experience;