precision highp float;

// send the uv coordinate to the fragment shader
varying vec2 vUv;

uniform float uUnadjustedPointSize;
uniform float uTime;

void main() {
    vUv = uv;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_Position.x += sin(uv.x);

    gl_PointSize = uUnadjustedPointSize;
    /**
    * Size attenuation
    * see see /node_modules/three/src/renderers/shaders/ShaderLib/point_vert.glsl.js
    */
    gl_PointSize *= (1.0 / - viewPosition.z);
}