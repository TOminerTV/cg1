precision mediump float;

varying vec2 fragTexCoord;
varying vec3 fragNormalCoord;

varying vec3 fragLightDirection;

uniform float shift;

uniform sampler2D samplerEarthDay;
uniform sampler2D samplerEarthNight;
uniform sampler2D samplerEarthClouds;
uniform sampler2D samplerEarthOceanMask;

void main()
{
    // lightDirection vector und normal vector normalisieren
    vec3 lightDirection = normalize(fragLightDirection);
    vec3 normalDirection = normalize(fragNormalCoord);

    // Skalarprodukt von normal und lightDirection vector berechnen
    // Weiche Kante zwischen Tag- und Nacht-Seite umrechnen => scharfe Kante
    // Skalarprodukt auf 0 - 1 mappen
    float diffuse = clamp((6.0 * dot(normalDirection, lightDirection) + 1.0) / 2.0, 0.0, 1.0);

    // Tagtextur und Nachttextur laden
    vec4 colorEarthDay = texture2D(samplerEarthDay, fragTexCoord);
    vec4 colorEarthNight = texture2D(samplerEarthNight, fragTexCoord);

    // Bewegende Wolkentextur laden (verschieben der Texturkoordinaten durch shift Wert)
    //    => besser r-Wert laden, da dieser zwischen 0 und 1 liegen kann und daher am besten für die mix-Funktion geeignet ist
    float colorClouds = texture2D(samplerEarthClouds, fragTexCoord - vec2(shift, 0.0)).r;

    // 0 steht für kein Licht und bildet 100% der gemischten Nachttextur ab
    // 1 steht für volles Licht und bildet 100% der Tagtextur ab
    // falls Nachtwert schwarz => Erdtextur abbilden ; falls Nachtwert weiß => Licht der Nachttextur abbilden
    vec3 earthColor = mix(colorEarthDay * 0.15 + colorEarthNight, colorEarthDay, diffuse).rgb;

    // Berechnen der Wolkenfarbe => weiß * (Anhebung des diffuse-Wertes + diffuse-Wert)
    //    => so dass dieser nie 0 erreichen kann und die Wolken auch auf der Nachtseite weißlicher erscheinen
    vec3 cloudColor = vec3(1.0, 1.0, 1.0) * (0.2 + diffuse);
    
    // 0 steht für schwarz und bildet 100% der Erdtextur ab
    // 1 steht für weiß und bildet 100% der Wolkenfarbe ab
    vec3 color = mix(earthColor, cloudColor, colorClouds);

    gl_FragColor = vec4(color, 1.0);
}