precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertTexCoord;
attribute vec3 vertNormalCoord;

varying vec3 fragTexCoord;
varying vec3 fragNormal;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main()
{
    gl_Position = projectionMatrix * viewMatrix * worldMatrix * vec4(vertPosition, 1.0);
    fragTexCoord = vertTexCoord;
    fragNormal = (worldMatrix * vec4(vertNormalCoord, 0.0)).xyz;
}