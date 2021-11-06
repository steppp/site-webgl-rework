import * as THREE from 'three'


const addLights = ({ scene }) => {
    // const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    // scene.add(ambientLight)

    const hemiLight = new THREE.HemisphereLight(0xffff22, 0x00fff0, 0.8)
    scene.add(hemiLight)
}

const lightManager = {
    addLights,
}

export default lightManager