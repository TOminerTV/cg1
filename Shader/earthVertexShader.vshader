precision mediump float;

attribute vec3 vertPosition;
attribute vec2 vertTexCoord;
attribute vec3 vertNormalCoord;

varying vec2 fragTexCoord;
varying vec3 fragNormalCoord;

varying vec3 fragLightDirection;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec3 lightDirection;

void main()
{
    gl_Position = projectionMatrix * viewMatrix * worldMatrix * vec4(vertPosition, 1.0);

    fragTexCoord = vertTexCoord;
    fragNormalCoord = (viewMatrix * worldMatrix * vec4(vertNormalCoord, 0.0)).xyz;

    fragLightDirection = (viewMatrix * vec4(-lightDirection, 0.0)).xyz;
}