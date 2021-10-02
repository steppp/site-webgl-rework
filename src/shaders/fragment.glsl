precision highp float;

// get the uv coordinates from the vertex shader
varying vec2 vUv;

void main() {
    // float border = 0.5;
    // float radius = 0.8;
    // float dist = radius - distance(gl_PointCoord, vec2(0.5));
    // float t = step(border, dist);
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 0.5 - strength;

    // vec3 color = vec3(gl_PointCoord, 1.0);
    vec3 color = vec3(1.0, 0.5, 0.5);
    gl_FragColor = vec4(color, strength);
    // gl_FragColor = vec4(vec3(gl_PointCoord, 1.0), 0.5);
}