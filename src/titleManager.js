import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

const addTitle = async ({scene, text}) => {
    const fontLoader = new FontLoader()

    const font = await fontLoader.loadAsync('/fonts/droid_sans_bold.typeface.json')
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
    textGeometry.translate(0, 0, -0.1)
    textMesh.castShadow = true
    textMesh.receiveShadow = true

    scene.add(textMesh)
    return textMesh
}

const titleManager = {
    addTitle
}

export default titleManager