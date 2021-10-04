precision highp float;

// get the uv coordinates from the vertex shader
varying vec2 vUv;

void main() {
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = step(0.4, strength);
    strength = 1.0 - strength;

    vec3 color = vec3(0.5137, 0.8039, 1.0);

    gl_FragColor = vec4(color, strength);
}