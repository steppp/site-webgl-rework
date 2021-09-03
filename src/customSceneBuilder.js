import * as THREE from 'three'
import { Vector3 } from 'three';

export class CustomSceneBuilder {
    // MARK: private members
    #enableHelpers;
    #buildBasePlane = (scene) => {
        const planeGeom = new THREE.PlaneGeometry(15, 15, 64, 64)
        // const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xff1234, side: THREE.DoubleSide })
        const planeMaterial = new THREE.MeshStandardMaterial({
            color: 0xbb99dd,
            roughness: 0.5,
        })
        this.basePlaneMesh = new THREE.Mesh(planeGeom, planeMaterial)
        this.basePlaneMesh.position.x = 0
        this.basePlaneMesh.position.y = -1
        this.basePlaneMesh.position.z = 0

        this.basePlaneMesh.rotation.x = Math.PI * -0.5

        scene.add(this.basePlaneMesh)
    }
    #buildMainLight = (scene) => {
        this.mainLight = new THREE.SpotLight(0xffdddd, 0.4)
        this.mainLight.position.y = 10
        this.mainLight.distance = 17             // distance at which the intensity drops to 0
        this.mainLight.angle = Math.PI * 0.2     // beam aperture
        this.mainLight.penumbra = 0.3           // how diffused is the contour of the beam
        this.mainLight.decay = 0                 // how fast the light dims

        this.mainLight.target.position.x = this.basePlaneMesh.position.x
        this.mainLight.target.position.y = this.basePlaneMesh.position.y
        this.mainLight.target.position.z = this.basePlaneMesh.position.z

        scene.add(this.mainLight)
        scene.add(this.mainLight.target)

        if (this.#enableHelpers) {
            const spotlightHelper = new THREE.SpotLightHelper(this.mainLight, 0x00ffff)
            scene.add(spotlightHelper)
        }
    }
    #buildSecondaryLight = (scene, position) => {
        this.secondaryLight = new THREE.SpotLight(0xfffefe, 1)
        this.secondaryLight.position.x = position.x
        this.secondaryLight.position.y = position.y
        this.secondaryLight.distance = 20             // distance at which the intensity drops to 0
        this.secondaryLight.angle = Math.PI * 0.05     // beam aperture
        this.secondaryLight.penumbra = 0.1           // how diffused is the contour of the beam
        this.secondaryLight.decay = 0                 // how fast the light dims

        this.secondaryLight.target.position.x = this.basePlaneMesh.position.x
        this.secondaryLight.target.position.y = this.basePlaneMesh.position.y
        this.secondaryLight.target.position.z = this.basePlaneMesh.position.z

        scene.add(this.secondaryLight)
        scene.add(this.secondaryLight.target)

        if (this.#enableHelpers) {
            const spotlightHelper = new THREE.SpotLightHelper(this.secondaryLight, 0xff0000)
            scene.add(spotlightHelper)
        }
    }

    constructor(scene, enableHelpers = true) {
        this.#enableHelpers = enableHelpers

        this.#buildBasePlane(scene)
        this.#buildMainLight(scene)
        this.#buildSecondaryLight(scene, new Vector3(0, 7, 0))
    }
}