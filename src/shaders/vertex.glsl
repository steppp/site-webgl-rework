precision highp float;

#define PI 3.14

// send the uv coordinate to the fragment shader
varying vec2 vUv;

uniform float uUnadjustedPointSize;
uniform float uTime;
uniform float uRotationSpeed;
uniform float uRand;
uniform float uIntensity;
uniform vec2 uMousePos;
uniform float uFrequency;
uniform float uSpeed;
uniform float uScale;

// define a pseudo-random function
float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

//  Classic Perlin 2D Noise
//  by Stefan Gustavson
//
vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main() {
    vUv = uv;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.xyz *= uScale;

    // TODO: we can use a parlin noise to get the vertices displacement values
    // float displacement = sin(modelPosition.x + uTime * 0.5) * sin(modelPosition.y + uTime * 0.5) / 3.0;
    // // displacement /= 5.0;
    // displacement -= cnoise(vec3(uv, sin(uv.x) * sin(uv.y))) ;
    // modelPosition.xyz *= 1.0 + displacement;

    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = uTime * uRotationSpeed;
    angle += angleOffset;

    float pos_x = cos(angle) * distanceToCenter;
    float pos_z = sin(angle) * distanceToCenter;
    modelPosition.x = pos_x;
    modelPosition.z = pos_z;

    float strength = cnoise(modelPosition.xy * uFrequency + uTime * uSpeed) / 10.0;

    // modelPosition *= uScale;
    modelPosition.xyz += uIntensity * strength;

    vec4 viewPosition = viewMatrix * modelPosition;
    float zDisplacement = smoothstep(0.0, 0.9, distance(viewPosition.xy, uMousePos));
    viewPosition.z += clamp(0.0, 0.2, zDisplacement);

    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uUnadjustedPointSize;
    /**
    * Size attenuation
    * see /node_modules/three/src/renderers/shaders/ShaderLib/point_vert.glsl.js
    */
    gl_PointSize *= max(0.5, 1.0 / - viewPosition.z);
}