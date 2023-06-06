class ForceField
{
    static FORCE_FIELD_SPEED = 1.0;

    static async init(webContext, canvas)
    {
        ForceField.program = await Utils.createProgram(webContext, "./Shader/forceFieldVertexShader.vshader", "./Shader/forceFieldFragmentShader.fshader");

        if(ForceField.program === null)
        {
            console.log('Da ist wohl etwas schief gelaufen!');
            return;
        }

        ForceField.vertices = await Utils.loadOBJ('./OBJs/Planet.obj');
        ForceField.vertexBufferObject = webContext.createBuffer();

        webContext.bindBuffer(webContext.ARRAY_BUFFER, ForceField.vertexBufferObject);
        webContext.bufferData(webContext.ARRAY_BUFFER, new Float32Array(ForceField.vertices), webContext.STATIC_DRAW);

        ForceField.positionAttribLocation = webContext.getAttribLocation(ForceField.program, 'vertPosition');
        ForceField.normalPositionAttribLocation = webContext.getAttribLocation(ForceField.program, 'vertNormalCoord');

        //!
        //! --- CREATE FORCEFIELD TEXTURES --- !\\
        //!
        ForceField.forceFieldTexture = webContext.createTexture();
        webContext.bindTexture(webContext.TEXTURE_2D, ForceField.forceFieldTexture);

        webContext.texParameteri(webContext.TEXTURE_2D, webContext.TEXTURE_MIN_FILTER, webContext.LINEAR_MIPMAP_LINEAR);
        webContext.texParameteri(webContext.TEXTURE_2D, webContext.TEXTURE_MAG_FILTER, webContext.LINEAR);

        webContext.pixelStorei(webContext.UNPACK_FLIP_Y_WEBGL, true);

        webContext.texImage2D(webContext.TEXTURE_2D, 0, webContext.RGBA, webContext.RGBA, webContext.UNSIGNED_BYTE, document.getElementById('forceField'));
        webContext.generateMipmap(webContext.TEXTURE_2D);


        webContext.vertexAttribPointer(
            ForceField.positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            0 // Offset from the beginning of a single vertex to this attribute
        );

        webContext.vertexAttribPointer(
            ForceField.normalPositionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            5 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.enableVertexAttribArray(ForceField.positionAttribLocation);
        webContext.enableVertexAttribArray(ForceField.normalPositionAttribLocation);

        // Tell OpenGL state machine which program should be active.
        webContext.useProgram(ForceField.program);

        ForceField.matWorldUniformLocation = webContext.getUniformLocation(ForceField.program, 'worldMatrix');
        ForceField.matViewUniformLocation = webContext.getUniformLocation(ForceField.program, 'viewMatrix');
        ForceField.matProjUniformLocation = webContext.getUniformLocation(ForceField.program, 'projectionMatrix');

        ForceField.worldMatrix = new Float32Array(16);
        ForceField.projMatrix = new Float32Array(16);

        GLMF.identity4x4(ForceField.worldMatrix);
        GLMF.scale(ForceField.worldMatrix, ForceField.worldMatrix, [1.5, 1.5, 1.5]);
        GLMF.perspective(ForceField.projMatrix, GLMF.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

        webContext.uniformMatrix4fv(ForceField.matWorldUniformLocation, webContext.FALSE, ForceField.worldMatrix);
        webContext.uniformMatrix4fv(ForceField.matProjUniformLocation, webContext.FALSE, ForceField.projMatrix);

        ForceField.identityMatrix = new Float32Array(16);
        GLMF.identity4x4(ForceField.identityMatrix);
        ForceField.angle = 0;

        return true;
    }

    static render(webContext, viewMatrix)
    {
        webContext.depthMask(false);
        webContext.enable(webContext.BLEND);

        webContext.useProgram(ForceField.program);
		webContext.bindBuffer(webContext.ARRAY_BUFFER, ForceField.vertexBufferObject);

        webContext.vertexAttribPointer(
            ForceField.positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            0 // Offset from the beginning of a single vertex to this attribute
        );

        webContext.vertexAttribPointer(
            ForceField.normalPositionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            5 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.enableVertexAttribArray(ForceField.positionAttribLocation);
        webContext.enableVertexAttribArray(ForceField.normalPositionAttribLocation);

        ForceField.angle = performance.now() / 10000 * ForceField.FORCE_FIELD_SPEED;
		GLMF.rotateY(ForceField.worldMatrix, ForceField.identityMatrix, ForceField.angle);
        GLMF.translate(ForceField.worldMatrix, ForceField.worldMatrix, [-10, 0, 0]);
        GLMF.scale(ForceField.worldMatrix, ForceField.worldMatrix, [0.4, 0.4, 0.4]);

        webContext.uniform3fv(webContext.getUniformLocation(ForceField.program, 'mainColor'), Utils.rgb255ToRgb1(52, 152, 219));
        webContext.uniform3fv(webContext.getUniformLocation(ForceField.program, 'borderColor'), [1.0, 1.0, 1.0]);

        webContext.uniformMatrix4fv(ForceField.matWorldUniformLocation, webContext.FALSE, ForceField.worldMatrix);
        webContext.uniformMatrix4fv(ForceField.matViewUniformLocation, webContext.FALSE, viewMatrix);

        webContext.activeTexture(webContext.TEXTURE0);
        webContext.bindTexture(webContext.TEXTURE_2D, ForceField.forceFieldTexture);

		webContext.drawArrays(webContext.TRIANGLES, 0, ForceField.vertices.length / 8);
    }
}