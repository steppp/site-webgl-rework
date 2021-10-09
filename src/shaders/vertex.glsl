precision highp float;

#define PI 3.14

// send the uv coordinate to the fragment shader
varying vec2 vUv;

uniform float uUnadjustedPointSize;
uniform float uTime;
uniform float uRotationSpeed;
uniform float uRand;

void main() {
    vUv = uv;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float angleXZ = atan(modelPosition.x, modelPosition.z);
    float distanceToCenterXZ = length(modelPosition.xz);
    float angleOffsetXZ = uTime * uRotationSpeed;
    angleXZ += angleOffsetXZ;

    float pos_x = cos(angleXZ) * distanceToCenterXZ;
    float pos_z = sin(angleXZ) * distanceToCenterXZ;
    modelPosition.x = pos_x;
    modelPosition.z = pos_z;

    // float angleYZ = atan(modelPosition.y, modelPosition.z);
    // float distanceToCenterYZ = length(modelPosition.yz);
    // float angleOffsetYZ = uTime * uRotationSpeed;
    // angleYZ += angleOffsetYZ;

    // float pos_x1 = cos(angleYZ) * distanceToCenterYZ;
    // float pos_y = sin(angleYZ) * distanceToCenterYZ;
    // modelPosition.x = pos_x1;
    // modelPosition.y = pos_y;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uUnadjustedPointSize;
    /**
    * Size attenuation
    * see /node_modules/three/src/renderers/shaders/ShaderLib/point_vert.glsl.js
    */
    // disable size attenuation since small particles would flicker
    // gl_PointSize *= max((1.0 / - viewPosition.z), 1.0);
}