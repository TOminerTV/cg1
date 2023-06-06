precision mediump float;

varying vec2 fragTexCoord;

uniform sampler2D samplerHologram;

void main()
{
    gl_FragColor = texture2D(samplerHologram, fragTexCoord);
}