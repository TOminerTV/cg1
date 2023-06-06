precision mediump float;

attribute vec3 vertPosition;

varying vec3 fragPosition;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main()
{
    gl_Position = projectionMatrix * viewMatrix * worldMatrix * vec4(vertPosition, 1.0);
    fragPosition = vertPosition;
}