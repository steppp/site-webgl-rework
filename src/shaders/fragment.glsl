precision highp float;

// get the uv coordinates from the vertex shader
varying vec2 vUv;

void main() {
    float border = 0.5;
    float radius = 0.8;
    float dist = radius - distance(gl_PointCoord, vec2(0.5));
    float t = step(border, dist);

    gl_FragColor = vec4(vec3(gl_PointCoord, 1.0), t);
    // gl_FragColor = vec4(vec3(gl_PointCoord, 1.0), 0.5);
}