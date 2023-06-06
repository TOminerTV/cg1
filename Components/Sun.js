class Sun
{
    static async init(webContext, canvas)
    {
        Sun.program = await Utils.createProgram(webContext, "./Shader/sunVertexShader.vshader", "./Shader/sunFragmentShader.fshader");

        if(Sun.program === null)
        {
            console.log('Da ist wohl etwas schief gelaufen!');
            return false;
        }

        Sun.vertices = await Utils.loadOBJ('./OBJs/Planet.obj');
        Sun.vertexBufferObject = webContext.createBuffer();

        webContext.bindBuffer(webContext.ARRAY_BUFFER, Sun.vertexBufferObject);
        webContext.bufferData(webContext.ARRAY_BUFFER, new Float32Array(Sun.vertices), webContext.STATIC_DRAW);

        Sun.positionAttribLocation = webContext.getAttribLocation(Sun.program, 'vertPosition');

        // SUN GRADIENT TEXTURE
        Sun.gradientTexture = webContext.createTexture();
        webContext.bindTexture(webContext.TEXTURE_2D, Sun.gradientTexture);

        webContext.texParameteri(webContext.TEXTURE_2D, webContext.TEXTURE_MIN_FILTER, webContext.LINEAR);
        webContext.texParameteri(webContext.TEXTURE_2D, webContext.TEXTURE_MAG_FILTER, webContext.LINEAR);
        webContext.texParameteri(webContext.TEXTURE_2D, webContext.TEXTURE_WRAP_S, webContext.CLAMP_TO_EDGE);
        webContext.texParameteri(webContext.TEXTURE_2D, webContext.TEXTURE_WRAP_T, webContext.CLAMP_TO_EDGE);

        webContext.texImage2D(webContext.TEXTURE_2D, 0, webContext.RGBA, webContext.RGBA, webContext.UNSIGNED_BYTE, document.getElementById('sunGradient'));
        webContext.generateMipmap(webContext.TEXTURE_2D);

        // Tell OpenGL state machine which program should be active.
        webContext.useProgram(Sun.program);

        Sun.worldMatrixUniformLocation = webContext.getUniformLocation(Sun.program, 'worldMatrix');
        Sun.viewMatrixUniformLocation = webContext.getUniformLocation(Sun.program, 'viewMatrix');
        Sun.projectionMatrixUniformLocation = webContext.getUniformLocation(Sun.program, 'projectionMatrix');

        Sun.worldMatrix = new Float32Array(16);
        Sun.projMatrix = new Float32Array(16);
        GLMF.identity4x4(Sun.worldMatrix);
        GLMF.perspective(Sun.projMatrix, GLMF.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

        webContext.uniformMatrix4fv(Sun.worldMatrixUniformLocation, webContext.FALSE, Sun.worldMatrix);
        webContext.uniformMatrix4fv(Sun.projectionMatrixUniformLocation, webContext.FALSE, Sun.projMatrix);

        Sun.identityMatrix = new Float32Array(16);
        GLMF.identity4x4(Sun.identityMatrix);

        return true;
    }

    static render(webContext, viewMatrix)
    {
        webContext.depthMask(true);
        webContext.enable(webContext.CULL_FACE);

        webContext.useProgram(Sun.program);
        webContext.bindBuffer(webContext.ARRAY_BUFFER, Sun.vertexBufferObject);
        
        webContext.activeTexture(webContext.TEXTURE0);
        webContext.bindTexture(webContext.TEXTURE_2D, Sun.gradientTexture);

        webContext.vertexAttribPointer(
			Sun.positionAttribLocation, // Attribute location
			3, // Number of elements per attribute
			webContext.FLOAT, // Type of elements
			webContext.FALSE,
			8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
			0 // Offset from the beginning of a single vertex to this attribute
		);

        webContext.enableVertexAttribArray(Sun.positionAttribLocation);

        const time = performance.now() / 1000;
        let timeUniformLocation = webContext.getUniformLocation(Sun.program, "time");
        webContext.uniform1f(timeUniformLocation, time);

        webContext.uniformMatrix4fv(Sun.viewMatrixUniformLocation, webContext.FALSE, viewMatrix);

        webContext.drawArrays(webContext.TRIANGLES, 0, Sun.vertices.length / 8);
    }
}