const parameters = {
    scene: {
        helpers: {
            axes: {
                guiName: 'Axes helper',
                visible: false,
                size: 1
            }
        },
        background: 0x15151b,
        animations: {
            rotationSpeed: -0.05
        },
        controls: {
            enabled: false
        }
    },
    meshes: {
        scale: 1,
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
            size: 2,
            color: 0x74c9f5,
            shaders: {
                frequency: 2,
                speed: 0.5,
                intensity: 1
            }
        }
    },
    camera: {
        fov: 90,
        aspectRatio: 0,
        near: 0.01,
        far: 10,
        initialPosition: {
            x: 0,
            y: 1.5,
            z: 1.7
        }
    }
}

parameters.camera.aspectRatio = window.innerWidth / window.innerHeight

export default parameters;