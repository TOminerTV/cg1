class MugItem2
{
    static async init(webContext, canvas)
    {
        MugItem2.program = await Utils.createProgram(webContext, "./Shader/itemVertexShader.vshader", "./Shader/itemFragmentShader.fshader");

        if(MugItem2.program === null)
        {
            console.log('Da ist wohl etwas schief gelaufen!');
            return false;
        }

        MugItem2.vertices = await Utils.loadOBJ('./OBJs/Mug.obj');
        MugItem2.vertexBufferObject = webContext.createBuffer();
        
        webContext.bindBuffer(webContext.ARRAY_BUFFER, MugItem2.vertexBufferObject);
        webContext.bufferData(webContext.ARRAY_BUFFER, new Float32Array(MugItem2.vertices), webContext.STATIC_DRAW);

        MugItem2.positionAttribLocation = webContext.getAttribLocation(MugItem2.program, 'vertPosition');
        MugItem2.texPositionAttribLocation = webContext.getAttribLocation(MugItem2.program, 'vertTexCoord');
        MugItem2.normalPositionAttribLocation = webContext.getAttribLocation(MugItem2.program, 'vertNormalCoord');

        webContext.vertexAttribPointer(
            MugItem2.positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            0 // Offset from the beginning of a single vertex to this attribute
        );

        webContext.vertexAttribPointer(
            MugItem2.texPositionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.vertexAttribPointer(
            MugItem2.normalPositionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            5 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.enableVertexAttribArray(MugItem2.positionAttribLocation);
        //webContext.enableVertexAttribArray(MugItem2.texPositionAttribLocation);
        webContext.enableVertexAttribArray(MugItem2.normalPositionAttribLocation);

        // Tell OpenGL state machine which program should be active.
        webContext.useProgram(MugItem2.program);
        
        MugItem2.matWorldUniformLocation = webContext.getUniformLocation(MugItem2.program, 'worldMatrix');
        MugItem2.matViewUniformLocation = webContext.getUniformLocation(MugItem2.program, 'viewMatrix');
        MugItem2.matProjUniformLocation = webContext.getUniformLocation(MugItem2.program, 'projectionMatrix');

        MugItem2.worldMatrix = new Float32Array(16);
        MugItem2.viewMatrix = new Float32Array(16);
        MugItem2.projMatrix = new Float32Array(16);

        GLMF.identity4x4(MugItem2.worldMatrix);
        GLMF.translate(MugItem2.worldMatrix, MugItem2.worldMatrix, [-0.25, -0.15, -12.9]);
        GLMF.scale(MugItem2.worldMatrix, MugItem2.worldMatrix, [0.02, 0.02, 0.02]);
        GLMF.lookAt(MugItem2.viewMatrix, [0, 0, -14], [0, 0, 0], [0, 1, 0]);
        GLMF.perspective(MugItem2.projMatrix, GLMF.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
        
        
        webContext.uniformMatrix4fv(MugItem2.matWorldUniformLocation, webContext.FALSE, MugItem2.worldMatrix);
        webContext.uniformMatrix4fv(MugItem2.matViewUniformLocation, webContext.FALSE, MugItem2.viewMatrix);
        webContext.uniformMatrix4fv(MugItem2.matProjUniformLocation, webContext.FALSE, MugItem2.projMatrix);
        
        return true;
    }
    
    static render(webContext, viewMatrix)
    {
        webContext.depthMask(true);
        webContext.enable(webContext.CULL_FACE);
        
        webContext.useProgram(MugItem2.program);
		webContext.bindBuffer(webContext.ARRAY_BUFFER, MugItem2.vertexBufferObject);

		webContext.vertexAttribPointer(
			MugItem2.positionAttribLocation, // Attribute location
			3, // Number of elements per attribute
			webContext.FLOAT, // Type of elements
			webContext.FALSE,
			8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
			0 // Offset from the beginning of a single vertex to this attribute
		);

        webContext.vertexAttribPointer(
            MugItem2.texPositionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.vertexAttribPointer(
            MugItem2.normalPositionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            5 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );
        
		webContext.enableVertexAttribArray(MugItem2.positionAttribLocation);
		webContext.enableVertexAttribArray(MugItem2.texPositionAttribLocation);
        webContext.enableVertexAttribArray(MugItem2.normalPositionAttribLocation);

        MugItem2.invViewMatrix = new Float32Array(9);
        GLMF.identity4x4(MugItem2.invViewMatrix);
        GLMF.matrix4ToMatrix3Invert(MugItem2.invViewMatrix, viewMatrix);
        
        MugItem2.eyeDirection = [0.0, 0.0, 1.0];
        
        GLMF.transformV3(MugItem2.eyeDirection, MugItem2.invViewMatrix);
        
        MugItem2.eyeDirectionUniformLocation = webContext.getUniformLocation(MugItem2.program, 'fragEyeDirection');
        webContext.uniform3fv(MugItem2.eyeDirectionUniformLocation, MugItem2.eyeDirection);

        GLMF.rotateX(MugItem2.worldMatrix, MugItem2.worldMatrix, 0.003);
        GLMF.rotateY(MugItem2.worldMatrix, MugItem2.worldMatrix, 0.002);
        GLMF.rotateZ(MugItem2.worldMatrix, MugItem2.worldMatrix, 0.003)
        webContext.uniformMatrix4fv(MugItem2.matWorldUniformLocation, webContext.FALSE, MugItem2.worldMatrix);

        webContext.activeTexture(webContext.TEXTURE0);

        webContext.bindTexture(webContext.TEXTURE_CUBE_MAP, Utils.SKYBOX_TEXTURE);

		webContext.drawArrays(webContext.TRIANGLES, 0, MugItem2.vertices.length / 8);
    }
}