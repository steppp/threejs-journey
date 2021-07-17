/*
    In contrast to RawShaderMaterial, ShaderMaterial provides by default:
        - uniform mat4 projectionMatrix;
        - uniform mat4 viewMatrix;
        - uniform mat4 modelMatrix;
        - attribute vec3 position;
        - attribute vec2 uv;
        - precision mediump float;
*/

// set the desired precision for the float type
// precision mediump float;

// directly access javascript-defined uniform
uniform vec3 uColor;

// uniform containing texture data
uniform sampler2D uTexture;

// get data from the vertex shader
// varyings are interpolated
// varying float vRandom;

// get the UV coordinates for placing the texture from the vertex shader
varying vec2 vUv;

// elevation data to darken/lighten the color
varying float vElevation;

void main() {
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 2.0 + 0.5;
    // gl_FragColor = textureColor;
    // a way to debug values is to use them as the value of the fragment color
    gl_FragColor = vec4(vUv, 0.5, 1.0);
}