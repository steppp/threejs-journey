varying vec3 vColor;

void main()
{
    // disc
    // // get the distance between the coordinate and the center
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // // use step to get 0 if distance is below 0.5, 1 otherwise
    // strength = step(0.5, strength);
    // // invert the value to have 1 near the center
    // strength = 1.0 - strength;

    // light point pattern
    // very intense center that dims fast
    // gl_PointCoord are the UV coordinates specific to the particles
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);

    vec3 color = mix(vec3(0.0), vColor, strength);
    gl_FragColor = vec4(color, 1.0);
}