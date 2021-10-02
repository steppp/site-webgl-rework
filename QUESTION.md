I'm trying to create a point cloud in Three.js r133 where particles are placed on the surface of a virtual sphere. This is the code I am using:

```
const particlesGeometry = new THREE.SphereGeometry(...)
const particlesMaterial = new THREE.ShaderMaterial({
    depthWrite: false,
    vertexColors: true,
    transparent: true,
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
})

```

In the vertex shader I only increase the size of the points and account for size attenuation:
```
gl_Position = projectedPosition;

gl_PointSize = 20.0;
// size attenuation
gl_PointSize *= (1.0 / - viewPosition.z);

```

The fragment shader is pretty basic but it gives strange (to me) results.
This code
```
vec3 color = vec3(gl_PointCoord, 1.0);
gl_FragColor = vec4(color, 0.5);

```
produces [this][1] output: **why is transparency not respected?**. Points start being transparent only when using 0.3 or less as the value of the alpha channel.

The other problem is that, even if particles have an opaque color, we can still see objects in the background rendered on top of ones in the foreground.
To solve this, I thought adding ```blending: THREE.AdditiveBlending``` in the ShaderMaterial parameters should have solved the issue, but [this][2] is the result: **why are colors shifted?** It seems like the coordinates get to 1 way before reaching the bottom right corner, could this be caused by the increased size of my particles?

One last strange behavior I encountered: 
```
float strength = distance(gl_PointCoord, vec2(0.5));
strength = 1.0 - strength;
vec3 color = vec3(1.0, 0.5, 0.5);
gl_FragColor = vec4(color, strength);
```
outputs [this][3], while it should render a particle with a solid color at the center that becomes (almost) transparent near the borders.
Anyway, I get the expected result by computing strength as ```0.5 - strength``` and disabling additive blending. Keeping it on results in [this][4].

Is **additive blending** the real source of problems here? Why even after enabling it I can still se particles that should not be visible instead? And why do particles coordinates seems to fall outside the (0.0, 1.0) range?

Tanks in advance.


  [1]: https://i.stack.imgur.com/uHK46.png
  [2]: https://i.stack.imgur.com/v1OMD.png
  [3]: https://i.stack.imgur.com/esKkL.png
  [4]: https://i.stack.imgur.com/zOj8f.png