class MugItem
{
    static async init(webContext, canvas)
    {
        MugItem.program = await Utils.createProgram(webContext, "./Shader/itemVertexShader.vshader", "./Shader/itemFragmentShader.fshader");

        if(MugItem.program === null)
        {
            console.log('Da ist wohl etwas schief gelaufen!');
            return false;
        }

        MugItem.vertices = await Utils.loadOBJ('./OBJs/Mug.obj');
        MugItem.vertexBufferObject = webContext.createBuffer();
        
        webContext.bindBuffer(webContext.ARRAY_BUFFER, MugItem.vertexBufferObject);
        webContext.bufferData(webContext.ARRAY_BUFFER, new Float32Array(MugItem.vertices), webContext.STATIC_DRAW);

        MugItem.positionAttribLocation = webContext.getAttribLocation(MugItem.program, 'vertPosition');
        MugItem.texPositionAttribLocation = webContext.getAttribLocation(MugItem.program, 'vertTexCoord');
        MugItem.normalPositionAttribLocation = webContext.getAttribLocation(MugItem.program, 'vertNormalCoord');

        webContext.vertexAttribPointer(
            MugItem.positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            0 // Offset from the beginning of a single vertex to this attribute
        );

        webContext.vertexAttribPointer(
            MugItem.texPositionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.vertexAttribPointer(
            MugItem.normalPositionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            5 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.enableVertexAttribArray(MugItem.positionAttribLocation);
        //webContext.enableVertexAttribArray(MugItem.texPositionAttribLocation);
        webContext.enableVertexAttribArray(MugItem.normalPositionAttribLocation);

        // Tell OpenGL state machine which program should be active.
        webContext.useProgram(MugItem.program);
        
        MugItem.matWorldUniformLocation = webContext.getUniformLocation(MugItem.program, 'worldMatrix');
        MugItem.matViewUniformLocation = webContext.getUniformLocation(MugItem.program, 'viewMatrix');
        MugItem.matProjUniformLocation = webContext.getUniformLocation(MugItem.program, 'projectionMatrix');

        MugItem.worldMatrix = new Float32Array(16);
        MugItem.viewMatrix = new Float32Array(16);
        MugItem.projMatrix = new Float32Array(16);

        GLMF.identity4x4(MugItem.worldMatrix);
        GLMF.translate(MugItem.worldMatrix, MugItem.worldMatrix, [0.25, -0.15, -12.6]);
        GLMF.scale(MugItem.worldMatrix, MugItem.worldMatrix, [0.02, 0.02, 0.02]);
        GLMF.lookAt(MugItem.viewMatrix, [0, 0, -14], [0, 0, 0], [0, 1, 0]);
        GLMF.perspective(MugItem.projMatrix, GLMF.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
        
        
        webContext.uniformMatrix4fv(MugItem.matWorldUniformLocation, webContext.FALSE, MugItem.worldMatrix);
        webContext.uniformMatrix4fv(MugItem.matViewUniformLocation, webContext.FALSE, MugItem.viewMatrix);
        webContext.uniformMatrix4fv(MugItem.matProjUniformLocation, webContext.FALSE, MugItem.projMatrix);
        
        return true;
    }
    
    static render(webContext, viewMatrix)
    {
        webContext.depthMask(true);
        webContext.enable(webContext.CULL_FACE);
        
        webContext.useProgram(MugItem.program);
		webContext.bindBuffer(webContext.ARRAY_BUFFER, MugItem.vertexBufferObject);

		webContext.vertexAttribPointer(
			MugItem.positionAttribLocation, // Attribute location
			3, // Number of elements per attribute
			webContext.FLOAT, // Type of elements
			webContext.FALSE,
			8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
			0 // Offset from the beginning of a single vertex to this attribute
		);

        webContext.vertexAttribPointer(
            MugItem.texPositionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.vertexAttribPointer(
            MugItem.normalPositionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            5 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );
        
		webContext.enableVertexAttribArray(MugItem.positionAttribLocation);
		webContext.enableVertexAttribArray(MugItem.texPositionAttribLocation);
        webContext.enableVertexAttribArray(MugItem.normalPositionAttribLocation);

        MugItem.invViewMatrix = new Float32Array(9);
        GLMF.identity4x4(MugItem.invViewMatrix);
        GLMF.matrix4ToMatrix3Invert(MugItem.invViewMatrix, viewMatrix);
        
        MugItem.eyeDirection = [0.0, 0.0, 1.0];
        
        GLMF.transformV3(MugItem.eyeDirection, MugItem.invViewMatrix);
        
        MugItem.eyeDirectionUniformLocation = webContext.getUniformLocation(MugItem.program, 'fragEyeDirection');
        webContext.uniform3fv(MugItem.eyeDirectionUniformLocation, MugItem.eyeDirection);

        GLMF.rotateY(MugItem.worldMatrix, MugItem.worldMatrix, 0.0034);
        GLMF.rotateX(MugItem.worldMatrix, MugItem.worldMatrix, 0.002);
        webContext.uniformMatrix4fv(MugItem.matWorldUniformLocation, webContext.FALSE, MugItem.worldMatrix);

        webContext.activeTexture(webContext.TEXTURE0);

        webContext.bindTexture(webContext.TEXTURE_CUBE_MAP, Utils.SKYBOX_TEXTURE);

		webContext.drawArrays(webContext.TRIANGLES, 0, MugItem.vertices.length / 8);
    }
}