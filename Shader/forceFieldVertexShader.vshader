precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertNormalCoord;

varying vec3 fragPosition;
varying vec3 fragNormalCoord;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main()
{
    gl_Position = projectionMatrix * viewMatrix * worldMatrix * vec4(vertPosition, 1.0);

    fragPosition = (viewMatrix * worldMatrix * vec4(vertPosition, 1.0)).xyz;
    fragNormalCoord = (viewMatrix * worldMatrix * vec4(vertNormalCoord, 0.0)).xyz;
}