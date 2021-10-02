precision highp float;

// send the uv coordinate to the fragment shader
varying vec2 vUv;

void main() {
    vUv = uv;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_PointSize = 10.0;
    /**
    * Size attenuation
    * see see /node_modules/three/src/renderers/shaders/ShaderLib/point_vert.glsl.js
    */
    gl_PointSize *= (1.0 / - viewPosition.z);

    gl_Position = projectedPosition;
}