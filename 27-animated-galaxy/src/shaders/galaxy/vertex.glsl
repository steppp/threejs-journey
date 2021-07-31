uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main()
{
    /**
    * Position
    */
    // model position is the position of the vertex after applying
    // the position, rotation and scale of the mesh
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    /**
    * Rotate
    */
    // calculate initial point parameters
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    // calculate the offset angle
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
    angle += angleOffset;
    // make the particles rotate
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    // Randomness
    modelPosition.xyz += aRandomness;

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