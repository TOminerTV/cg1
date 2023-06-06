class Spaceship
{
    static async init(webContext, canvas)
    {
        //* Spaceship Programm erstellen *\\
        Spaceship.program = await Utils.createProgram(webContext, "./Shader/spaceshipVertexShader.vshader", "./Shader/spaceshipFragmentShader.fshader");

        //* Programm auf "null" prüfen *\\
        if(Spaceship.program === null)
        {
            console.log('Da ist wohl etwas schief gelaufen!');
            return false;
        }

        //* Vertices laden und WebGL-Buffer erstellen *\\
        Spaceship.vertices = await Utils.loadOBJ('./OBJs/SpaceshipNoGlass_06.obj');
        Spaceship.vertexBufferObject = webContext.createBuffer();

        //* Vertices an Buffer binden *\\
        webContext.bindBuffer(webContext.ARRAY_BUFFER, Spaceship.vertexBufferObject);
        webContext.bufferData(webContext.ARRAY_BUFFER, new Float32Array(Spaceship.vertices), webContext.STATIC_DRAW);

        //!
        //! --- CREATE SPACESHIP TEXTURE --- !\\
        //!
        Spaceship.spaceshipTexture = webContext.createTexture();
        webContext.bindTexture(webContext.TEXTURE_2D, Spaceship.spaceshipTexture);

        webContext.texParameteri(webContext.TEXTURE_2D, webContext.TEXTURE_MIN_FILTER, webContext.LINEAR_MIPMAP_LINEAR);
        webContext.texParameteri(webContext.TEXTURE_2D, webContext.TEXTURE_MAG_FILTER, webContext.LINEAR);

        webContext.texImage2D(webContext.TEXTURE_2D, 0, webContext.RGBA, webContext.RGBA, webContext.UNSIGNED_BYTE, document.getElementById('spaceship'));
        webContext.generateMipmap(webContext.TEXTURE_2D);

        //! -------------------------------- !//

        //* Attribut-Pointer (Locations) speichern und Daten verknüpfen, sowie die Pointer aktivieren *\\
        Spaceship.positionAttribLocation = webContext.getAttribLocation(Spaceship.program, 'vertPosition');
        Spaceship.texPositionAttribLocation = webContext.getAttribLocation(Spaceship.program, 'vertTexCoord');
        Spaceship.normalPositionAttribLocation = webContext.getAttribLocation(Spaceship.program, 'vertNormalCoord');

        webContext.vertexAttribPointer(
            Spaceship.positionAttribLocation, //* Attribut-Pointer (Location) *\\
            3, //* Anzahl der Elemente pro Attribut *\\
            webContext.FLOAT, //* Elemententyp *\\
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, //* Größe jedes Vertices [3 Vertex-Coords / 2 Texture-Coords / 3 Normal-Coords] *\\
            0 //* Verschiebung vom Anfang eines Vertices *\\
        );

        webContext.vertexAttribPointer(
            Spaceship.texPositionAttribLocation, //* Attribut-Pointer (Location) *\\
            2, //* Anzahl der Elemente pro Attribut *\\
            webContext.FLOAT, //* Elemententyp *\\
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, //* Größe jedes Vertices [3 Vertex-Coords / 2 Texture-Coords / 3 Normal-Coords] *\\
            3 * Float32Array.BYTES_PER_ELEMENT //* Verschiebung vom Anfang eines Vertices *\\
        );

        webContext.vertexAttribPointer(
            Spaceship.normalPositionAttribLocation, //* Attribut-Pointer (Location) *\\
            3, //* Anzahl der Elemente pro Attribut *\\
            webContext.FLOAT, //* Elemententyp *\\
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, //* Größe jedes Vertices [3 Vertex-Coords / 2 Texture-Coords / 3 Normal-Coords] *\\
            5 * Float32Array.BYTES_PER_ELEMENT //* Verschiebung vom Anfang eines Vertices *\\
        );

        webContext.enableVertexAttribArray(Spaceship.positionAttribLocation);
        webContext.enableVertexAttribArray(Spaceship.texPositionAttribLocation);
        webContext.enableVertexAttribArray(Spaceship.normalPositionAttribLocation);

        //* Spaceship Programm aktivieren *\\
        webContext.useProgram(Spaceship.program);

        //* Uniform-Pointer (Locations) speichern und Matrizen berechnen (World-, View-, Proj-Matrizen), sowie Daten verknüpfen *\\
        Spaceship.matWorldUniformLocation = webContext.getUniformLocation(Spaceship.program, 'worldMatrix');
        Spaceship.matViewUniformLocation = webContext.getUniformLocation(Spaceship.program, 'viewMatrix');
        Spaceship.matProjUniformLocation = webContext.getUniformLocation(Spaceship.program, 'projectionMatrix');

        Spaceship.lightDirectionUniformLocation = webContext.getUniformLocation(Spaceship.program, 'lightDirection');

        Spaceship.worldMatrix = new Float32Array(16);
        Spaceship.viewMatrix = new Float32Array(16);
        Spaceship.projMatrix = new Float32Array(16);

        GLMF.identity4x4(Spaceship.worldMatrix);
        GLMF.translate(Spaceship.worldMatrix, Spaceship.worldMatrix, [0, -1, -13]);
        GLMF.lookAt(Spaceship.viewMatrix, [0, 0, -14], [0, 0, 0], [0, 1, 0]);
        GLMF.perspective(Spaceship.projMatrix, GLMF.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

        webContext.uniformMatrix4fv(Spaceship.matWorldUniformLocation, webContext.FALSE, Spaceship.worldMatrix);
        webContext.uniformMatrix4fv(Spaceship.matViewUniformLocation, webContext.FALSE, Spaceship.viewMatrix);
        webContext.uniformMatrix4fv(Spaceship.matProjUniformLocation, webContext.FALSE, Spaceship.projMatrix);

        webContext.uniform3fv(webContext.getUniformLocation(Spaceship.program, 'ambientColor'), Utils.rgb255ToRgb1(29, 36, 44));
        webContext.uniform3fv(webContext.getUniformLocation(Spaceship.program, 'diffuseColor'), Utils.rgb255ToRgb1(52, 60, 69));
        webContext.uniform3fv(webContext.getUniformLocation(Spaceship.program, 'specularColor'), Utils.rgb255ToRgb1(227, 154, 8));

        webContext.uniform1f(webContext.getUniformLocation(Spaceship.program, 'shininess'), 10.0);

        //* Alles erfolgreich *\\
        return true;
    }

    static render(webContext, viewMatrix)
    {
        //* Tiefenbuffer und Abschneiden von nicht sichtbaren Flächen aktivieren *\\
        webContext.depthMask(true);
        webContext.enable(webContext.CULL_FACE);

        //* Spaceship Programm aktivieren und Vertecies erneut verknüpfen *\\
        webContext.useProgram(Spaceship.program);
		webContext.bindBuffer(webContext.ARRAY_BUFFER, Spaceship.vertexBufferObject);

        //* Attribut-Daten verknüpfen und die Pointer aktivieren *\\
        webContext.vertexAttribPointer(
            Spaceship.positionAttribLocation, //* Attribut-Pointer (Location) *\\
            3, //* Anzahl der Elemente pro Attribut *\\
            webContext.FLOAT, //* Elemententyp *\\
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, //* Größe jedes Vertices [3 Vertex-Coords / 2 Texture-Coords / 3 Normal-Coords] *\\
            0 //* Verschiebung vom Anfang eines Vertices *\\
        );

        webContext.vertexAttribPointer(
            Spaceship.texPositionAttribLocation, //* Attribut-Pointer (Location) *\\
            2, //* Anzahl der Elemente pro Attribut *\\
            webContext.FLOAT, //* Elemententyp *\\
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, //* Größe jedes Vertices [3 Vertex-Coords / 2 Texture-Coords / 3 Normal-Coords] *\\
            3 * Float32Array.BYTES_PER_ELEMENT //* Verschiebung vom Anfang eines Vertices *\\
        );

        webContext.vertexAttribPointer(
            Spaceship.normalPositionAttribLocation, //* Attribut-Pointer (Location) *\\
            3, //* Anzahl der Elemente pro Attribut *\\
            webContext.FLOAT, //* Elemententyp *\\
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, //* Größe jedes Vertices [3 Vertex-Coords / 2 Texture-Coords / 3 Normal-Coords] *\\
            5 * Float32Array.BYTES_PER_ELEMENT //* Verschiebung vom Anfang eines Vertices *\\
        );

        webContext.enableVertexAttribArray(Spaceship.positionAttribLocation);
        webContext.enableVertexAttribArray(Spaceship.texPositionAttribLocation);
        webContext.enableVertexAttribArray(Spaceship.normalPositionAttribLocation);

        //* Lichrichtung, "von der Sonne aus kommend", an den Shader übergeben *\\
        webContext.uniform3fv(Spaceship.lightDirectionUniformLocation, [viewMatrix[12], viewMatrix[13], viewMatrix[14]]);

        //* Textur des Spaceships verknüpfen *\\
        webContext.activeTexture(webContext.TEXTURE0);
        webContext.bindTexture(webContext.TEXTURE_2D, Spaceship.spaceshipTexture);

        //* Spaceship zeichnen *\\
		webContext.drawArrays(webContext.TRIANGLES, 0, Spaceship.vertices.length / 8);
    }
}