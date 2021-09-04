import * as THREE from 'three'
import { MeshStandardMaterial, Vector3 } from 'three';

export class CustomSceneBuilder {
    // MARK: static members
    static meshesSegmentsCount = 64

    // MARK: public members
    sceneSubjects = []

    // MARK: private members
    #enableHelpers
    #buildBasePlane = (scene, sizes) => {
        const planeGeom = new THREE.PlaneGeometry(sizes.x, sizes.y, CustomSceneBuilder.meshesSegmentsCount, CustomSceneBuilder.meshesSegmentsCount)
        const planeMaterial = new THREE.MeshStandardMaterial({
            color: 0xbb99dd,
            roughness: 0.5,
        })
        this.basePlaneMesh = new THREE.Mesh(planeGeom, planeMaterial)
        this.basePlaneMesh.position.x = -1.4
        this.basePlaneMesh.position.y = -1
        this.basePlaneMesh.position.z = 0

        this.basePlaneMesh.rotation.x = Math.PI * -0.5

        scene.add(this.basePlaneMesh)

        this.basePlaneMesh.castShadow = true
        this.basePlaneMesh.receiveShadow = true
    }
    #buildMainLight = (scene) => {
        this.mainLight = new THREE.SpotLight(0xffdddd, 0.4)
        this.mainLight.position.y = 10
        this.mainLight.distance = 17            // distance at which the intensity drops to 0
        this.mainLight.angle = Math.PI * 0.2    // beam aperture
        this.mainLight.penumbra = 0.3           // how diffused is the contour of the beam
        this.mainLight.decay = 0                // how fast the light dims

        // point the main light to the center of the base plane
        this.mainLight.target.position.x = this.basePlaneMesh.position.x
        this.mainLight.target.position.y = this.basePlaneMesh.position.y
        this.mainLight.target.position.z = this.basePlaneMesh.position.z

        scene.add(this.mainLight)
        scene.add(this.mainLight.target)

        if (this.#enableHelpers?.lights) {
            const spotlightHelper = new THREE.SpotLightHelper(this.mainLight, 0x00ffff)
            scene.add(spotlightHelper)
        }
    }
    #buildSecondaryLight = (scene, position) => {
        this.secondaryLight = new THREE.SpotLight(0xfffefe, 1)
        this.secondaryLight.position.x = position.x
        this.secondaryLight.position.y = position.y
        this.secondaryLight.position.z = position.z
        this.secondaryLight.distance = 20               // distance at which the intensity drops to 0
        this.secondaryLight.angle = Math.PI * 0.06      // beam aperture
        this.secondaryLight.penumbra = 0.1              // how diffused is the contour of the beam
        this.secondaryLight.decay = 0                   // how fast the light dims

        this.secondaryLight.target.position.x = this.basePlaneMesh.position.x
        this.secondaryLight.target.position.y = this.basePlaneMesh.position.y
        this.secondaryLight.target.position.z = this.basePlaneMesh.position.z

        this.secondaryLight.castShadow = true
        this.secondaryLight.shadow.mapSize.width = 512
        this.secondaryLight.shadow.mapSize.height = 512
        this.secondaryLight.shadow.camera.fov = 40
        this.secondaryLight.shadow.camera.near = 1
        this.secondaryLight.shadow.camera.far = 40

        scene.add(this.secondaryLight)
        scene.add(this.secondaryLight.target)

        if (this.#enableHelpers?.lights) {
            const spotlightHelper = new THREE.SpotLightHelper(this.secondaryLight, 0xff0000)
            scene.add(spotlightHelper)
        }

        if (this.#enableHelpers?.shadows) {
            const spotlightShadowCameraHelper = new THREE.CameraHelper(this.secondaryLight.shadow.camera)
            scene.add(spotlightShadowCameraHelper)
        }
    }
    #buildCube = (scene, sizes, position) => {
        const cubeMesh = new THREE.Mesh(
            new THREE.BoxGeometry(sizes.x, sizes.y, sizes.z,
                CustomSceneBuilder.meshesSegmentsCount, CustomSceneBuilder.meshesSegmentsCount, CustomSceneBuilder.meshesSegmentsCount),
            new MeshStandardMaterial({
                color: 0xff0000,
                roughness: 0,
                metalness: 0
            })
        )
        scene.add(cubeMesh)
        cubeMesh.position.x = position.x
        cubeMesh.position.y = position.y
        cubeMesh.position.z = position.z

        cubeMesh.rotation.y = Math.PI * 0.1

        this.sceneSubjects.push(cubeMesh)

        cubeMesh.castShadow = true
        cubeMesh.receiveShadow = true
    }

    constructor(scene, enableHelpers = {
        lights: false,
        shadows: false
    }) {
        this.#enableHelpers = enableHelpers

        this.#buildBasePlane(scene, {
            x: 15,
            y: 15
        })
        this.#buildMainLight(scene)
        this.#buildSecondaryLight(scene, new Vector3(5, 5, 7))

        // create 3 cubes
        for (const i of [0, 1, 2]) {
            this.#buildCube(scene, {
                x: 1.3,
                y: 1.3,
                z: 1.3
            }, {
                x: -3 + i * 3,
                y: -0.4,
                z: 3 - i * 1.5
            })
        }
    }
}