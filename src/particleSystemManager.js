import * as THREE from 'three'
import configuration from './configuration'
import loggingManager from './loggingManager'


const PARTICLES_OBJ_NAME = 'main-mesh'
let particleSystem = null

let particlesVertexShader = null
let particlesFragmentShader = null

const setup = (config) => {
    const  { vertexShader, fragmentShader } = config
    particlesVertexShader = vertexShader
    particlesFragmentShader = fragmentShader
}

const getDefaultMaterialUniforms = _ => ({
    // uUnadjustedPointSize: {
    //     value: configuration.meshes.particles.size
    // },
    uColor: {
        value: new THREE.Color(configuration.meshes.particles.color)
    },
    uTime: {
        value: 0
    },
    uRotationSpeed: {
        value: configuration.scene.animations.rotationSpeed
    },
    uRand: {
        value: 0
    },
    uIntensity: {
        value: configuration.meshes.particles.shaders.intensity
    },
    uMousePos: {
        value: new THREE.Vector2()
    },
    uFrequency: {
        value: configuration.meshes.particles.shaders.frequency
    },
    uSpeed: {
        value: configuration.meshes.particles.shaders.speed
    },
    uScale: {
        value: configuration.meshes.scale
    }
})

const buildParticleSystem = (geom, additionalUniforms) => {
    // use object spread to merge the two uniforms objects
    // note that properties from obj2 will rewrite properties with
    // the same name from obj1
    const materialUniforms ={ 
        ...getDefaultMaterialUniforms(),    // obj1
        ...additionalUniforms               // obj2
    }
    const particlesMaterial = new THREE.ShaderMaterial({
        vertexShader: particlesVertexShader,
        fragmentShader: particlesFragmentShader,
        uniforms: materialUniforms
    })

    // clone the values of the input geometry position attribute
    const pointsPositions = geom.getAttribute('position').clone()
    // create a new buffer geometry and set its position attribute
    // equal to the values just cloned
    const particlesGeometry = new THREE.BufferGeometry()
    particlesGeometry.setAttribute('position', pointsPositions)
    particleSystem = new THREE.Points(particlesGeometry, particlesMaterial)
    particleSystem.name = PARTICLES_OBJ_NAME

    loggingManager.log('info', 'Particle manager with name {0} built', PARTICLES_OBJ_NAME)

    return particleSystem
}

const updateMaterialUniforms = (updatedUniforms) => {
    // use again object destructuring assignment to update properties of the first object
    for (const propName of Object.keys(updatedUniforms)) {
        particleSystem.material.uniforms[propName].value =
            updatedUniforms[propName].value
    }
    // particleSystem.material.uniforms = {
    //     ...particleSystem.material.uniforms,
    //     ...updatedUniforms
    // }
}

const updateSceneParticles = (scene, particlesMesh) => {
    const prevParticlesObject = scene.getObjectByName(PARTICLES_OBJ_NAME)
    if (prevParticlesObject) {
        prevParticlesObject.removeFromParent()
    }

    scene.add(particlesMesh)
}

const particlesSystemManager = (_ => {
    return {
        setup,
        buildParticleSystem,    // TODO: add the return value to the scene
        updateMaterialUniforms,
        updateSceneParticles
    }
})()

export default particlesSystemManager