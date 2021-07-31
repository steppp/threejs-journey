
// texture from the previous pass
uniform sampler2D tDiffuse;

uniform vec3 uTint;

// get the uv coordinates from the vertex shader
varying vec2 vUv;

void main()
{
    // to get the pixels from a sampler2D (texture), we need to use
    // texture2D which requires a taexture as the first parameter and
    // UV coordinates as the second one
    vec4 color = texture2D(tDiffuse, vUv);
    color.rgb += uTint;
    gl_FragColor = color;
}