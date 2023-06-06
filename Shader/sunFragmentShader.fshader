precision mediump float;

varying vec3 fragPosition;

uniform float time;
uniform sampler2D sampler;


// Noise functions
float noise(vec3 fragPosition)
{
    //return fract(sin(fragPosition.x * 100.0 + fragPosition.y * 100.0 + fragPosition.z * 100.0) * 5647.0);
    return fract(sin(fragPosition.x * 100.0 + fragPosition.y * 6574.0 + fragPosition.z * 11436.0) * 5647.0);
}

float smoothNoise(vec3 fragPosition)
{
    vec3 localUVCoord = smoothstep(0.0, 1.0, fract(fragPosition));
    vec3 id = floor(fragPosition);

    float frontBottomLeft = noise(id);
    float frontBottomRight = noise(id + vec3(1.0, 0.0, 0.0));
    float frontBottom = mix(frontBottomLeft, frontBottomRight, localUVCoord.x);

    float frontTopLeft = noise(id + vec3(0.0, 1.0, 0.0));
    float frontTopRight = noise(id + vec3(1.0, 1.0, 0.0));
    float frontTop = mix(frontTopLeft, frontTopRight, localUVCoord.x);

    float front = mix(frontBottom, frontTop, localUVCoord.y);


    float backBottomLeft = noise(id + vec3(0.0, 0.0, 1.0));
    float backBottomRight = noise(id + vec3(1.0, 0.0, 1.0));
    float backBottom = mix(backBottomLeft, backBottomRight, localUVCoord.x);

    float backTopLeft = noise(id + vec3(0.0, 1.0, 1.0));
    float backTopRight = noise(id + vec3(1.0, 1.0, 1.0));
    float backTop = mix(backTopLeft, backTopRight, localUVCoord.x);

    float back = mix(backBottom, backTop, localUVCoord.y);

    return mix(front, back, localUVCoord.z);
}

float layeredSmoothNoise(vec3 fragPosition)
{
    float noise = smoothNoise(fragPosition * 4.0);
    noise += smoothNoise(fragPosition * 8.0) * 0.5;
    noise += smoothNoise(fragPosition * 16.0) * 0.25;
    noise += smoothNoise(fragPosition * 32.0) * 0.125;
    noise += smoothNoise(fragPosition * 64.0) * 0.0625;

    return noise / 2.0;
}

void main()
{
    gl_FragColor = texture2D(sampler, vec2(layeredSmoothNoise(fragPosition * 4.0 + vec3(time, 0, time) * 0.1), 0));
}