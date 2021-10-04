const parameters = {
    scene: {
        background: 0x15151b
    },
    meshes: {
        sphere: {
            geometry: {
                // TODO: set the radius such that the sphere always covers n% of the page width
                radius: 1,
                segments: 128
            }
        },
        box: {
            geometry: {
                width: 1,
                height: 1,
                depth: 1,
                segments: 64,
            }
        },
        particles: {
            size: 0.003,
            color: 0xf0f0f3,
        }
    },
    camera: {
        fov: 90,
        aspectRatio: 0
    }
}

parameters.camera.aspectRatio = window.innerWidth / window.innerHeight

export default parameters;