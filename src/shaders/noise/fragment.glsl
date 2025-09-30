uniform float uOpacity;
uniform float uWhites;
uniform float uBlacks;
uniform float uTime;

varying vec2 vUv;

#pragma glslify: snoise = require('../utils/simplex-2d.glsl')
#pragma glslify: random = require('../utils/random.glsl')

void main(void) {
    vec3 noiseColors = vec3(
        snoise(vec2(random(vUv + sin(uTime)))) * uBlacks + uWhites
    );


    gl_FragColor = vec4(noiseColors, uOpacity);
}