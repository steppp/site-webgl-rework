import configuration from './configuration'
import sizeManager from './sizeManager'
import helpersManager from './helpersManager'
import * as THREE from 'three'

const init = (targetCanvas) => {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(configuration.scene.background)

    const renderer = new THREE.WebGLRenderer({
        canvas: targetCanvas,
        powerPreference: 'high-performance'
    })
    renderer.setSize(sizeManager.sizes.width, sizeManager.sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    return {
        renderer,
        scene
    }
}

const setupScene = (scene) => {
    helpersManager.addAxesHelper(scene, configuration.scene.helpers.axes)
}

const experience = (() => {
    return {
        run: (canvasElement) => {
            const { renderer, scene } = init(canvasElement)
            setupScene(scene)

            return coreExpObj
        }
    }
})()

export default experience;