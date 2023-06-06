class CupItem
{
    static async init(webContext, canvas)
    {
        CupItem.program = await Utils.createProgram(webContext, "./Shader/itemVertexShader.vshader", "./Shader/itemFragmentShader.fshader");

        if(CupItem.program === null)
        {
            console.log('Da ist wohl etwas schief gelaufen!');
            return false;
        }

        CupItem.vertices = await Utils.loadOBJ('./OBJs/Cup.obj');
        CupItem.vertexBufferObject = webContext.createBuffer();
        
        webContext.bindBuffer(webContext.ARRAY_BUFFER, CupItem.vertexBufferObject);
        webContext.bufferData(webContext.ARRAY_BUFFER, new Float32Array(CupItem.vertices), webContext.STATIC_DRAW);

        CupItem.positionAttribLocation = webContext.getAttribLocation(CupItem.program, 'vertPosition');
        CupItem.texPositionAttribLocation = webContext.getAttribLocation(CupItem.program, 'vertTexCoord');
        CupItem.normalPositionAttribLocation = webContext.getAttribLocation(CupItem.program, 'vertNormalCoord');

        webContext.vertexAttribPointer(
            CupItem.positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            0 // Offset from the beginning of a single vertex to this attribute
        );

        webContext.vertexAttribPointer(
            CupItem.texPositionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.vertexAttribPointer(
            CupItem.normalPositionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            5 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.enableVertexAttribArray(CupItem.positionAttribLocation);
        //webContext.enableVertexAttribArray(CupItem.texPositionAttribLocation);
        webContext.enableVertexAttribArray(CupItem.normalPositionAttribLocation);

        // Tell OpenGL state machine which program should be active.
        webContext.useProgram(CupItem.program);
        
        CupItem.matWorldUniformLocation = webContext.getUniformLocation(CupItem.program, 'worldMatrix');
        CupItem.matViewUniformLocation = webContext.getUniformLocation(CupItem.program, 'viewMatrix');
        CupItem.matProjUniformLocation = webContext.getUniformLocation(CupItem.program, 'projectionMatrix');

        CupItem.worldMatrix = new Float32Array(16);
        CupItem.viewMatrix = new Float32Array(16);
        CupItem.projMatrix = new Float32Array(16);

        GLMF.identity4x4(CupItem.worldMatrix);
        GLMF.translate(CupItem.worldMatrix, CupItem.worldMatrix, [0.17, -0.15, -12.9]);
        GLMF.scale(CupItem.worldMatrix, CupItem.worldMatrix, [0.018, 0.018, 0.018]);
        GLMF.lookAt(CupItem.viewMatrix, [0, 0, -14], [0, 0, 0], [0, 1, 0]);
        GLMF.perspective(CupItem.projMatrix, GLMF.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
        
        
        webContext.uniformMatrix4fv(CupItem.matWorldUniformLocation, webContext.FALSE, CupItem.worldMatrix);
        webContext.uniformMatrix4fv(CupItem.matViewUniformLocation, webContext.FALSE, CupItem.viewMatrix);
        webContext.uniformMatrix4fv(CupItem.matProjUniformLocation, webContext.FALSE, CupItem.projMatrix);
        
        return true;
    }
    
    static render(webContext, viewMatrix)
    {
        webContext.depthMask(true);
        webContext.enable(webContext.CULL_FACE);
        
        webContext.useProgram(CupItem.program);
		webContext.bindBuffer(webContext.ARRAY_BUFFER, CupItem.vertexBufferObject);

		webContext.vertexAttribPointer(
			CupItem.positionAttribLocation, // Attribute location
			3, // Number of elements per attribute
			webContext.FLOAT, // Type of elements
			webContext.FALSE,
			8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
			0 // Offset from the beginning of a single vertex to this attribute
		);

        webContext.vertexAttribPointer(
            CupItem.texPositionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.vertexAttribPointer(
            CupItem.normalPositionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            5 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );
        
		webContext.enableVertexAttribArray(CupItem.positionAttribLocation);
		webContext.enableVertexAttribArray(CupItem.texPositionAttribLocation);
        webContext.enableVertexAttribArray(CupItem.normalPositionAttribLocation);

        CupItem.invViewMatrix = new Float32Array(9);
        GLMF.identity4x4(CupItem.invViewMatrix);
        GLMF.matrix4ToMatrix3Invert(CupItem.invViewMatrix, viewMatrix);
        
        CupItem.eyeDirection = [0.0, 0.0, 1.0];
        
        GLMF.transformV3(CupItem.eyeDirection, CupItem.invViewMatrix);
        
        CupItem.eyeDirectionUniformLocation = webContext.getUniformLocation(CupItem.program, 'fragEyeDirection');
        webContext.uniform3fv(CupItem.eyeDirectionUniformLocation, CupItem.eyeDirection);

        GLMF.rotateY(CupItem.worldMatrix, CupItem.worldMatrix, 0.0026);
        GLMF.rotateZ(CupItem.worldMatrix, CupItem.worldMatrix, 0.001);
        GLMF.rotateX(CupItem.worldMatrix, CupItem.worldMatrix, 0.0014);
        webContext.uniformMatrix4fv(CupItem.matWorldUniformLocation, webContext.FALSE, CupItem.worldMatrix);

        webContext.activeTexture(webContext.TEXTURE0);

        webContext.bindTexture(webContext.TEXTURE_CUBE_MAP, Utils.SKYBOX_TEXTURE);

		webContext.drawArrays(webContext.TRIANGLES, 0, CupItem.vertices.length / 8);
    }
}