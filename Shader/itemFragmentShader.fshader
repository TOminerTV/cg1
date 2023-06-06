precision mediump float;

varying vec3 fragTexCoord;
varying vec3 fragNormal;

uniform vec3 fragEyeDirection;

uniform samplerCube samplerSkybox;

void main()
{
    vec3 eyeDirection = normalize(fragEyeDirection);
    vec3 normalDirection = normalize(fragNormal);
    vec3 reflection = textureCube(samplerSkybox, reflect(-eyeDirection, normalDirection)).rgb;

    gl_FragColor = vec4(reflection, 1.0);
}