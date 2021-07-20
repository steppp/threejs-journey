#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

// define a pseudo-random function
float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.x
    );
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

void main()
{
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 0.4);

    // pattern 1
    // gl_FragColor = vec4(vUv, 1.0, 1.0);

    // pattern 2
    // gl_FragColor = vec4(vUv, 0.0, 1.0);

    // pattern 3
    // float strenght = vUv.x;
    // gl_FragColor = vec4(vec3(strenght), 1.0);

    // pattern 4
    // float strenght = vUv.y;
    // gl_FragColor = vec4(vec3(strenght), 1.0);

    // pattern 5
    // float strenght = 1.0 - vUv.y;
    // gl_FragColor = vec4(vec3(strenght), 1.0);

    // pattern 6
    // squeeze many values to 1 and above
    // values greate than 1 are white since we cannot render brighter colors than white
    // float strenght = vUv.y * 10.0;
    // gl_FragColor = vec4(vec3(strenght), 1.0);

    // pattern 7
    // float strenght = mod(vUv.y * 10.0, 1.0);
    // gl_FragColor = vec4(vec3(strenght), 1.0);

    // pattern 8
    // float strenght = mod(vUv.y * 10.0, 1.0);
    // strenght = step(0.5, strenght);
    // gl_FragColor = vec4(vec3(strenght), 1.0);

    // pattern 9
    // float strenght = mod(vUv.y * 10.0, 1.0);
    // strenght = step(0.8, strenght);
    // gl_FragColor = vec4(vec3(strenght), 1.0);

    // pattern 10
    // float strenght = mod(vUv.x * 10.0, 1.0);
    // strenght = step(0.8, strenght);
    // gl_FragColor = vec4(vec3(strenght), 1.0);

    // pattern 11
    // float strenght = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strenght += step(0.8, mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(vec3(strenght), 1.0);

    // pattern 12
    // float strenght = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strenght *= step(0.8, mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(vec3(strenght), 1.0);

    // pattern 13
    // float strenght = step(0.4, mod(vUv.x * 10.0, 1.0));
    // strenght *= step(0.8, mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(vec3(strenght), 1.0);

    // pattern 14
    // mod => create 10 repeating patterns on the other axis
    // step => make a clear cut instead of transitioning between values which cross the boundary
    // do the same for the other axis and multiply them
    // this will have the effect of "masking" some values
    // do for both axes and sum the results (join the two sets)
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
    // float strength = barX + barY;
    // vec3 mixedColor = mix(blackColor, uvColor, strength);
    // gl_FragColor = vec4(vec3(mixedColor), 1.0);

    // pattern 15
    // adding an offset to the first mod argument makes the value move in some direction
    float barX = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0 - 0.2, 1.0));
    float strength = barX + barY;
    // in the intersections the output value is higher than 1
    strength = clamp(strength, 0.0, 1.0);
    vec3 mixedColor = mix(blackColor, uvColor, strength);
    gl_FragColor = vec4(vec3(mixedColor), 1.0);

    // pattern 16
    // subtract 0.5 from uv x value to range from -0.5, 0.5
    // then use abs to have positive values only again
    // float strength = abs(vUv.x - 0.5);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 17
    // apply the same pattern for the y axis and then
    // compute the minimum between the two
    // float strengthX = abs(vUv.x - 0.5);
    // float strengthY = abs(vUv.y - 0.5);
    // float strength = min(strengthX, strengthY);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 18
    // same as above but using max
    // float strengthX = abs(vUv.x - 0.5);
    // float strengthY = abs(vUv.y - 0.5);
    // float strength = max(strengthX, strengthY);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 19
    // float strengthX = abs(vUv.x - 0.5);
    // float strengthY = abs(vUv.y - 0.5);
    // float strength = max(strengthX, strengthY);
    // gl_FragColor = vec4(vec3(step(0.2, strength)), 1.0);

    // pattern 20
    // multiplication of the previous square with another
    // but smaller and inverted
    // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // strength *= 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 21
    // here net color separations are obtained applying the floor
    // function to the x coordinate multipled by 10:
    // all the values until the next integer one have the same floor value
    // then divide by 10 to return into the 0, 1 range
    // float strength = floor(vUv.x * 10.0) / 10.0;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 22
    // same as above but for both axes
    // float strengthX = floor(vUv.x * 10.0) / 10.0;
    // float strengthY = floor(vUv.y * 10.0) / 10.0;
    // gl_FragColor = vec4(vec3(strengthX * strengthY), 1.0);

    // pattern 23
    // generating pseudo-random values with a deterministic function
    // float strength = random(vUv);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 24
    // combination of the two previous ones
    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
    // // random creates a pseudo-random grid for every element in the input matrix
    // float strength = random(gridUv);
    // vec3 mixedColor = mix(blackColor, uvColor, strength);
    // gl_FragColor = vec4(vec3(mixedColor), 1.0);

    // pattern 25
    // same as before, but the tilt effect is obtained adding half the value
    // of the x component to the y component before calculating the floor value
    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0);
    // float strength = random(gridUv);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 26
    // length returns the distance between the origin and the point
    // float strength = length(vUv);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 26a
    // length returns the distance between the origin and the point
    // float strength = floor((1.0 - length(vUv)) * 10.0) / 10.0;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 27
    // distance behaves as length but accepts an additional parameter
    // which is substituted to the origin point to compute the distance
    // float strength = distance(vUv, vec2(0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 28
    // float strength = 1.0 - distance(vUv, vec2(0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 29
    // distance behaves as length but accepts an additional parameter
    // which is substituted to the origin point to compute the distance
    // float strength = 0.015 / distance(vUv, vec2(0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 30
    // same pattern but with the UV squeezed and moved on the y axis only
    // float strength = 0.15 / distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 31
    // same as before but for the x axis too
    // float strength = 0.15 / distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5));
    // strength *= 0.15 / distance(vec2((vUv.x - 0.5) * 5.0 + 0.5, vUv.y), vec2(0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 32
    // get the rotated uv coordinates using our custom function
    // vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));
    // compute values as the previous example
    // float strength = 0.15 / (distance(vec2(rotatedUv.x, (rotatedUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));
    // strength *= 0.15 / (distance(vec2(rotatedUv.y, (rotatedUv.x - 0.5) * 5.0 + 0.5), vec2(0.5)));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 33
    // we could also have changed the first parameter of step (edge)
    // to control the circle radius
    // float strength = step(0.5, distance(vUv, vec2(0.5)) + 0.25);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 34
    // close to the previous one but subtracting a value and using abs
    // the circle will havo color on the inside too 
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 35
    // combine the two previous ones to get a circle
    // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 36
    // invert the previous example to get a white-on-black circle
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 37
    // add a wave deformation to the values before applying the same
    // function as the previous example
    // vec2 wavedUv = vec2(
    //     vUv.x,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));
    // vec3 mixedColor = mix(blackColor, uvColor, strength);
    // gl_FragColor = vec4(vec3(mixedColor), 1.0);

    // pattern 38
    // apply the same function as before to the x values too
    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * 30.0) * 0.1,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));
    // vec3 mixedColor = mix(blackColor, uvColor, strength);
    // gl_FragColor = vec4(vec3(mixedColor), 1.0);

    // pattern 39
    // increase the sin frequency to have a psychedelic effect
    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * 100.0) * 0.1,
    //     vUv.y + sin(vUv.x * 100.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));
    // vec3 mixedColor = mix(blackColor, uvColor, strength);
    // gl_FragColor = vec4(vec3(mixedColor), 1.0);

    // pattern 40
    // actually the angle of the uv, calculated using atan
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 41
    // actually the angle of the uv, calculated using atan
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength = angle;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 42
    // map the values to 0.0, 1.0: currently atan returns a value between -pi, pi
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // divide by 2pi to have a value between -0.5 and 0.5
    // angle /= PI * 2.0;
    // add 0.5 to move to the 0.0, 1.0 interval
    // angle += 0.5;
    // float strength = angle;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 43
    // same as before but applying the same modulo operation of
    // one of the previous examples
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
    // float strength = mod(angle * 20.0, 1.0);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 44
    // same as before but with sin instead of mod
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
    // float strength = sin(angle * 100.0);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 45
    // get the angle just as before
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
    // compute a variable length for the radius using the sin  function
    // float radius = 0.25 + sin(angle * 100.0) * 0.02;
    // draw the circle as before
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 46
    // perlin noise
    // float strength = cnoise(vUv * 10.0);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 47
    // perlin noise for a cow
    // float strength = step(0.0, cnoise(vUv * 10.0));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 48
    // float strength = 1.0 - abs(cnoise(vUv * 10.0));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 49
    // float strength = sin(cnoise(vUv * 10.0) * 20.0);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // pattern 50
    // float strength = step(0.8, sin(cnoise(vUv * 10.0) * 20.0));
    // vec3 mixedColor = mix(blackColor, uvColor, strength);
    // gl_FragColor = vec4(vec3(mixedColor), 1.0);
}