class Hologram
{
    static async init(webContext, canvas)
    {
        Hologram.program = await Utils.createProgram(webContext, "./Shader/hologramVertexShader.vshader", "./Shader/hologramFragmentShader.fshader");

        if(Hologram.program === null)
        {
            console.log('Da ist wohl etwas schief gelaufen!');
            return false;
        }

        Hologram.vertices = await Utils.loadOBJ('./OBJs/Planet.obj');
        Hologram.vertexBufferObject = webContext.createBuffer();

        webContext.bindBuffer(webContext.ARRAY_BUFFER, Hologram.vertexBufferObject);
        webContext.bufferData(webContext.ARRAY_BUFFER, new Float32Array(Hologram.vertices), webContext.STATIC_DRAW);

        Hologram.positionAttribLocation = webContext.getAttribLocation(Hologram.program, 'vertPosition');
        Hologram.texPositionAttribLocation = webContext.getAttribLocation(Hologram.program, 'vertTexCoord');

        //!
        //! --- CREATE HOLOGRAM TEXTURES --- !\\
        //!
        Hologram.texture = webContext.createTexture();
        webContext.activeTexture(webContext.TEXTURE0);
        webContext.bindTexture(webContext.TEXTURE_2D, Hologram.texture);

        webContext.texParameteri(webContext.TEXTURE_2D, webContext.TEXTURE_MIN_FILTER, webContext.LINEAR);
        webContext.texParameteri(webContext.TEXTURE_2D, webContext.TEXTURE_MAG_FILTER, webContext.LINEAR);

        webContext.texImage2D(webContext.TEXTURE_2D, 0, webContext.RGBA, webContext.RGBA, webContext.UNSIGNED_BYTE, document.getElementById('hologram'));

        webContext.vertexAttribPointer(
            Hologram.positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            0 // Offset from the beginning of a single vertex to this attribute
        );

        webContext.vertexAttribPointer(
            Hologram.texPositionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.enableVertexAttribArray(Hologram.positionAttribLocation);
        webContext.enableVertexAttribArray(Hologram.texPositionAttribLocation);

        // Tell OpenGL state machine which program should be active.
        webContext.useProgram(Hologram.program);

        Hologram.matWorldUniformLocation = webContext.getUniformLocation(Hologram.program, 'worldMatrix');
        Hologram.matViewUniformLocation = webContext.getUniformLocation(Hologram.program, 'viewMatrix');
        Hologram.matProjUniformLocation = webContext.getUniformLocation(Hologram.program, 'projectionMatrix');
        
        Hologram.worldMatrix = new Float32Array(16);
        Hologram.viewMatrix = new Float32Array(16);
        Hologram.projMatrix = new Float32Array(16);
        
        GLMF.identity4x4(Hologram.worldMatrix);
        GLMF.translate(Hologram.worldMatrix, Hologram.worldMatrix, [0, -0.21, -12.12]);
        GLMF.scale(Hologram.worldMatrix, Hologram.worldMatrix, [0.09, 0.09, 0.09]);
        GLMF.lookAt(Hologram.viewMatrix, [0, 0, -14], [0, 0, 0], [0, 1, 0]);
        GLMF.perspective(Hologram.projMatrix, GLMF.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

        webContext.uniformMatrix4fv(Hologram.matWorldUniformLocation, webContext.FALSE, Hologram.worldMatrix);
        webContext.uniformMatrix4fv(Hologram.matViewUniformLocation, webContext.FALSE, Hologram.viewMatrix);
        webContext.uniformMatrix4fv(Hologram.matProjUniformLocation, webContext.FALSE, Hologram.projMatrix);

        return true;
    }

    static render(webContext)
    {
        webContext.depthMask(false);
        webContext.enable(webContext.BLEND);

        webContext.useProgram(Hologram.program);
		webContext.bindBuffer(webContext.ARRAY_BUFFER, Hologram.vertexBufferObject);

        webContext.vertexAttribPointer(
            Hologram.positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            0 // Offset from the beginning of a single vertex to this attribute
        );

        webContext.vertexAttribPointer(
            Hologram.texPositionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.enableVertexAttribArray(Hologram.positionAttribLocation);
        webContext.enableVertexAttribArray(Hologram.texPositionAttribLocation);

        GLMF.translate(Hologram.worldMatrix, Hologram.worldMatrix, [0, Math.sin((performance.now() / 1000) * 0.6 * Math.PI) * 0.002, 0]);
        webContext.uniformMatrix4fv(Hologram.matWorldUniformLocation, webContext.FALSE, Hologram.worldMatrix);

        webContext.activeTexture(webContext.TEXTURE0);
        webContext.bindTexture(webContext.TEXTURE_2D, Hologram.texture);
        webContext.texImage2D(webContext.TEXTURE_2D, 0, webContext.RGBA, webContext.RGBA, webContext.UNSIGNED_BYTE, document.getElementById('hologram'));

		webContext.drawArrays(webContext.TRIANGLES, 0, Hologram.vertices.length / 8);
    }
}