uniform float uSize;

attribute float aScale;

varying vec3 vColor;

void main()
{
    /**
    * Position
    */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    /**
    * Size
    */
    gl_PointSize = uSize * aScale;

    /**
    * Size attenuation
    * see see /node_modules/three/src/renderers/shaders/ShaderLib/point_vert.glsl.js
    * 
    */
    gl_PointSize *= (1.0 / - viewPosition.z);

    // color is automatically prepended to the code
    // since we are using ShaderMaterial instead of RawShaderMaterial
    vColor = color;
}