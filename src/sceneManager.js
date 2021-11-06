
let scene = null



const sceneManager = _ => {
    scene = new THREE.Scene()
    return {
        scene
    }
}

export default sceneManager