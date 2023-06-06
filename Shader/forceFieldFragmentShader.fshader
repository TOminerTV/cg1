precision mediump float;

varying vec3 fragPosition;
varying vec3 fragNormalCoord;

uniform vec3 mainColor;
uniform vec3 borderColor;

void main()
{
    vec3 normalDirection = normalize(fragNormalCoord);

    vec3 viewDirection = -fragPosition;
    viewDirection = normalize(viewDirection);
    
    float fresnel = 1.0 - dot(normalDirection, viewDirection);
    vec3 color = mix(mainColor, borderColor, pow(fresnel, 2.0));

    gl_FragColor = vec4(color, .4);
}