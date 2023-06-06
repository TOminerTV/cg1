precision mediump float;

varying vec3 fragPosition;
varying vec2 fragTexCoord;
varying vec3 fragNormalCoord;

varying vec3 fragLightDirection;

uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;

uniform float shininess;

uniform sampler2D samplerSpaceship;

void main()
{
    // Normalisierte Normalen und Lichtrichtung berechnen
    vec3 normal = normalize(fragNormalCoord);
    vec3 light = normalize(fragLightDirection - fragPosition);

    // Lambert-Abstrahl Wert berechnen
    float lambertValue = max(dot(normal, light), 0.0);

    // Reflektionsvektor berechnen
    vec3 reflection = reflect(-light, normal);

    // Normalisierter Vektor zur Kamera berechnen
    vec3 cameraVec = normalize(-fragPosition);

    // Spiegelnden-Wert (specular) berechnen
    float specularAngle = max(dot(reflection, cameraVec), 0.0);
    float specular = pow(specularAngle, shininess);

    // Phong-Shading zusammen rechnen
    vec4 color = vec4(ambientColor + lambertValue * diffuseColor + specular * specularColor, 1.0);

    // Spaceship-Color (Textur) laden
    float colorSpaceship = texture2D(samplerSpaceship, fragTexCoord).r;

    // Beleuchtung + Textur verrechnen
    gl_FragColor = color + colorSpaceship;
}