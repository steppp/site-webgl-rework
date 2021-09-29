const parameters = {
    scene: {
        background: 0x15151b
    },
    meshes: {
        sphere: {
            geometry: {
                // TODO: set the radius such that the sphere always covers n% of the page width
                radius: 1,
                segments: 48
            }
        },
        particles: {
            size: 0.001,
            color: 0xf0f0f3
        }
    },
    camera: {
        fov: 90,
        aspectRatio: 0
    }
}

parameters.camera.aspectRatio = parameters.global.sizes.width / parameters.global.sizes.height

export default parameters;