import configuration from './configuration'
import * as THREE from 'three'

const setupScene = (targetCanvas) => {
    console.log(typeof(targetCanvas))
}

const experience = {
    run: (canvasElement) => {
        setupScene(canvasElement)
    }
}

export default experience;