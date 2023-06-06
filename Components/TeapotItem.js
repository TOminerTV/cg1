class TeapotItem
{
    static async init(webContext, canvas)
    {
        TeapotItem.program = await Utils.createProgram(webContext, "./Shader/itemVertexShader.vshader", "./Shader/itemFragmentShader.fshader");

        if(TeapotItem.program === null)
        {
            console.log('Da ist wohl etwas schief gelaufen!');
            return false;
        }

        TeapotItem.vertices = await Utils.loadOBJ('./OBJs/Teapot.obj');
        TeapotItem.vertexBufferObject = webContext.createBuffer();
        
        webContext.bindBuffer(webContext.ARRAY_BUFFER, TeapotItem.vertexBufferObject);
        webContext.bufferData(webContext.ARRAY_BUFFER, new Float32Array(TeapotItem.vertices), webContext.STATIC_DRAW);

        TeapotItem.positionAttribLocation = webContext.getAttribLocation(TeapotItem.program, 'vertPosition');
        TeapotItem.texPositionAttribLocation = webContext.getAttribLocation(TeapotItem.program, 'vertTexCoord');
        TeapotItem.normalPositionAttribLocation = webContext.getAttribLocation(TeapotItem.program, 'vertNormalCoord');

        webContext.vertexAttribPointer(
            TeapotItem.positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            0 // Offset from the beginning of a single vertex to this attribute
        );

        webContext.vertexAttribPointer(
            TeapotItem.texPositionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.vertexAttribPointer(
            TeapotItem.normalPositionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            5 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.enableVertexAttribArray(TeapotItem.positionAttribLocation);
        //webContext.enableVertexAttribArray(TeapotItem.texPositionAttribLocation);
        webContext.enableVertexAttribArray(TeapotItem.normalPositionAttribLocation);

        // Tell OpenGL state machine which program should be active.
        webContext.useProgram(TeapotItem.program);
        
        TeapotItem.matWorldUniformLocation = webContext.getUniformLocation(TeapotItem.program, 'worldMatrix');
        TeapotItem.matViewUniformLocation = webContext.getUniformLocation(TeapotItem.program, 'viewMatrix');
        TeapotItem.matProjUniformLocation = webContext.getUniformLocation(TeapotItem.program, 'projectionMatrix');

        TeapotItem.worldMatrix = new Float32Array(16);
        TeapotItem.viewMatrix = new Float32Array(16);
        TeapotItem.projMatrix = new Float32Array(16);

        GLMF.identity4x4(TeapotItem.worldMatrix);
        GLMF.translate(TeapotItem.worldMatrix, TeapotItem.worldMatrix, [0.27, -0.15, -12.9]);
        GLMF.scale(TeapotItem.worldMatrix, TeapotItem.worldMatrix, [0.02, 0.02, 0.02]);
        GLMF.lookAt(TeapotItem.viewMatrix, [0, 0, -14], [0, 0, 0], [0, 1, 0]);
        GLMF.perspective(TeapotItem.projMatrix, GLMF.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
        
        
        webContext.uniformMatrix4fv(TeapotItem.matWorldUniformLocation, webContext.FALSE, TeapotItem.worldMatrix);
        webContext.uniformMatrix4fv(TeapotItem.matViewUniformLocation, webContext.FALSE, TeapotItem.viewMatrix);
        webContext.uniformMatrix4fv(TeapotItem.matProjUniformLocation, webContext.FALSE, TeapotItem.projMatrix);
        
        return true;
    }
    
    static render(webContext, viewMatrix)
    {
        webContext.depthMask(true);
        webContext.enable(webContext.CULL_FACE);
        
        webContext.useProgram(TeapotItem.program);
		webContext.bindBuffer(webContext.ARRAY_BUFFER, TeapotItem.vertexBufferObject);

		webContext.vertexAttribPointer(
			TeapotItem.positionAttribLocation, // Attribute location
			3, // Number of elements per attribute
			webContext.FLOAT, // Type of elements
			webContext.FALSE,
			8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
			0 // Offset from the beginning of a single vertex to this attribute
		);

        webContext.vertexAttribPointer(
            TeapotItem.texPositionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.vertexAttribPointer(
            TeapotItem.normalPositionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            5 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );
        
		webContext.enableVertexAttribArray(TeapotItem.positionAttribLocation);
		webContext.enableVertexAttribArray(TeapotItem.texPositionAttribLocation);
        webContext.enableVertexAttribArray(TeapotItem.normalPositionAttribLocation);

        TeapotItem.invViewMatrix = new Float32Array(9);
        GLMF.identity4x4(TeapotItem.invViewMatrix);
        GLMF.matrix4ToMatrix3Invert(TeapotItem.invViewMatrix, viewMatrix);
        
        TeapotItem.eyeDirection = [0.0, 0.0, 1.0];
        
        GLMF.transformV3(TeapotItem.eyeDirection, TeapotItem.invViewMatrix);
        
        TeapotItem.eyeDirectionUniformLocation = webContext.getUniformLocation(TeapotItem.program, 'fragEyeDirection');
        webContext.uniform3fv(TeapotItem.eyeDirectionUniformLocation, TeapotItem.eyeDirection);

        GLMF.rotateZ(TeapotItem.worldMatrix, TeapotItem.worldMatrix, 0.003);
        GLMF.rotateY(TeapotItem.worldMatrix, TeapotItem.worldMatrix, 0.0025);
        GLMF.rotateX(TeapotItem.worldMatrix, TeapotItem.worldMatrix, 0.002);
        webContext.uniformMatrix4fv(TeapotItem.matWorldUniformLocation, webContext.FALSE, TeapotItem.worldMatrix);

        webContext.activeTexture(webContext.TEXTURE0);

        webContext.bindTexture(webContext.TEXTURE_CUBE_MAP, Utils.SKYBOX_TEXTURE);

		webContext.drawArrays(webContext.TRIANGLES, 0, TeapotItem.vertices.length / 8);
    }
}