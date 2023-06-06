class Skybox
{
    static async init(webContext, canvas)
    {
        Skybox.program = await Utils.createProgram(webContext, "./Shader/skyboxVertexShader.vshader", "./Shader/skyboxFragmentShader.fshader");

        if(Skybox.program === null)
        {
            console.log('Da ist wohl etwas schief gelaufen!');
            return false;
        }

        Skybox.vertices = await Utils.loadOBJ('./OBJs/Skybox.obj');
        Skybox.vertexBufferObject = webContext.createBuffer();

        webContext.bindBuffer(webContext.ARRAY_BUFFER, Skybox.vertexBufferObject);
        webContext.bufferData(webContext.ARRAY_BUFFER, new Float32Array(Skybox.vertices), webContext.STATIC_DRAW);

        Skybox.positionAttribLocation = webContext.getAttribLocation(Skybox.program, 'position');

        webContext.vertexAttribPointer(
            Skybox.positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            0 // Offset from the beginning of a single vertex to this attribute
        );

        webContext.enableVertexAttribArray(Skybox.positionAttribLocation);

        // Tell OpenGL state machine which program should be active.
        webContext.useProgram(Skybox.program);

        Skybox.matViewUniformLocation = webContext.getUniformLocation(Skybox.program, 'viewMatrix');
        Skybox.matProjUniformLocation = webContext.getUniformLocation(Skybox.program, 'projectionMatrix');

        Skybox.viewMatrix = new Float32Array(16);
        Skybox.projectionMatrix = new Float32Array(16);

        GLMF.perspective(Skybox.projectionMatrix, GLMF.toRadian(90), canvas.width / canvas.height, 0.01, 100);

        webContext.uniformMatrix4fv(Skybox.matViewUniformLocation, webContext.FALSE, Skybox.viewMatrix);
        webContext.uniformMatrix4fv(Skybox.matProjUniformLocation, webContext.FALSE, Skybox.projectionMatrix);

        Skybox.angle = 0;

        return true;
    }

    static render(webContext, viewMatrix)
    {
        webContext.depthMask(false);
        webContext.disable(webContext.CULL_FACE);

        webContext.useProgram(Skybox.program);
        webContext.bindBuffer(webContext.ARRAY_BUFFER, Skybox.vertexBufferObject);

        webContext.activeTexture(webContext.TEXTURE0);

        webContext.vertexAttribPointer(
            Skybox.positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            0 // Offset from the beginning of a single vertex to this attribute
        );

        webContext.enableVertexAttribArray(Skybox.positionAttribLocation);

        for(let i = 0; i < viewMatrix.length; i++)
        {
            Skybox.viewMatrix[i] = viewMatrix[i];
        }

        Skybox.viewMatrix[12] = Skybox.viewMatrix[13] = Skybox.viewMatrix[14] = 0;
        webContext.uniformMatrix4fv(Skybox.matViewUniformLocation, webContext.FALSE, Skybox.viewMatrix);

		webContext.drawArrays(webContext.TRIANGLES, 0, Skybox.vertices.length / 8);
    }
}