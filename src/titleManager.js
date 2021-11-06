import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

const addTitle = async ({scene, text}) => {
    const fontLoader = new FontLoader()

    const font = await fontLoader.loadAsync('/fonts/droid_sans_bold.typeface.json')
    const textGeometry = new TextGeometry(text, {
        font,
        size: 0.2,
        height: 0.04
    })
    const textSideMaterial = new THREE.MeshPhongMaterial({
        color: 0xDDF093,
        flatShading: true
    })
    const textFaceMaterial = new THREE.MeshPhongMaterial({
        color: 0x90E39A
    })

    const textMesh = new THREE.Mesh(
        textGeometry, [textFaceMaterial, textSideMaterial]
    )
    textGeometry.center()
    textGeometry.translate(0, 0, -0.5)

    scene.add(textMesh)
    return textMesh
}

const titleManager = {
    addTitle
}

export default titleManager