class Earth
{
    static EARTH_SPEED = 1.0;

    static async init(webContext, canvas)
    {
        Earth.program = await Utils.createProgram(webContext, "./Shader/earthVertexShader.vshader", "./Shader/earthFragmentShader.fshader");

        if(Earth.program === null)
        {
            console.log('Da ist wohl etwas schief gelaufen!');
            return;
        }

        Earth.vertices = await Utils.loadOBJ('./OBJs/Planet.obj');
        Earth.vertexBufferObject = webContext.createBuffer();

        webContext.bindBuffer(webContext.ARRAY_BUFFER, Earth.vertexBufferObject);
        webContext.bufferData(webContext.ARRAY_BUFFER, new Float32Array(Earth.vertices), webContext.STATIC_DRAW);

        //!
        //! --- CREATE EARTH TEXTURES --- !\\
        //!
        //? --- EARTH DAY TEXTURE --- ?\\
        Earth.dayTexture = webContext.createTexture();
        webContext.activeTexture(webContext.TEXTURE0);
        webContext.bindTexture(webContext.TEXTURE_2D, Earth.dayTexture);

        webContext.texParameteri(webContext.TEXTURE_2D, webContext.TEXTURE_MIN_FILTER, webContext.LINEAR_MIPMAP_LINEAR);
        webContext.texParameteri(webContext.TEXTURE_2D, webContext.TEXTURE_MAG_FILTER, webContext.LINEAR);

        webContext.pixelStorei(webContext.UNPACK_FLIP_Y_WEBGL, true);

        webContext.texImage2D(webContext.TEXTURE_2D, 0, webContext.RGBA, webContext.RGBA, webContext.UNSIGNED_BYTE, document.getElementById('planetEarthDay'));
        webContext.generateMipmap(webContext.TEXTURE_2D);

        //? --- EARTH NIGHT TEXTURE --- ?\\
        Earth.nightTexture = webContext.createTexture();
        webContext.activeTexture(webContext.TEXTURE1);
        webContext.bindTexture(webContext.TEXTURE_2D, Earth.nightTexture);

        webContext.texParameteri(webContext.TEXTURE_2D, webContext.TEXTURE_MIN_FILTER, webContext.LINEAR_MIPMAP_LINEAR);
        webContext.texParameteri(webContext.TEXTURE_2D, webContext.TEXTURE_MAG_FILTER, webContext.LINEAR);

        webContext.pixelStorei(webContext.UNPACK_FLIP_Y_WEBGL, true);

        webContext.texImage2D(webContext.TEXTURE_2D, 0, webContext.RGBA, webContext.RGBA, webContext.UNSIGNED_BYTE, document.getElementById('planetEarthNight'));
        webContext.generateMipmap(webContext.TEXTURE_2D);

        
        //? --- EARTH CLOUDS TEXTURE --- ?\\
        Earth.cloudsTexture = webContext.createTexture();
        webContext.activeTexture(webContext.TEXTURE2);
        webContext.bindTexture(webContext.TEXTURE_2D, Earth.cloudsTexture);

        webContext.texParameteri(webContext.TEXTURE_2D, webContext.TEXTURE_MIN_FILTER, webContext.LINEAR_MIPMAP_LINEAR);
        webContext.texParameteri(webContext.TEXTURE_2D, webContext.TEXTURE_MAG_FILTER, webContext.LINEAR);

        webContext.pixelStorei(webContext.UNPACK_FLIP_Y_WEBGL, true);

        webContext.texImage2D(webContext.TEXTURE_2D, 0, webContext.RGBA, webContext.RGBA, webContext.UNSIGNED_BYTE, document.getElementById('planetEarthClouds'));
        webContext.generateMipmap(webContext.TEXTURE_2D);

        Earth.samplerEarthDayUniformLocation = webContext.getUniformLocation(Earth.program, 'samplerEarthDay');
        webContext.uniform1i(Earth.samplerEarthUniformLocation, 0);
        Earth.samplerEarthNightUniformLocation = webContext.getUniformLocation(Earth.program, 'samplerEarthNight');
        webContext.uniform1i(Earth.samplerEarthNightUniformLocation, 1);
        Earth.samplerEarthCloudsUniformLocation = webContext.getUniformLocation(Earth.program, 'samplerEarthClouds');
        webContext.uniform1i(Earth.samplerEarthCloudsUniformLocation, 2);


        Earth.positionAttribLocation = webContext.getAttribLocation(Earth.program, 'vertPosition');
        Earth.texPositionAttribLocation = webContext.getAttribLocation(Earth.program, 'vertTexCoord');
        Earth.normalPositionAttribLocation = webContext.getAttribLocation(Earth.program, 'vertNormalCoord');

        webContext.vertexAttribPointer(
            Earth.positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            0 // Offset from the beginning of a single vertex to this attribute
        );

        webContext.vertexAttribPointer(
            Earth.texPositionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.vertexAttribPointer(
            Earth.normalPositionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            5 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.enableVertexAttribArray(Earth.positionAttribLocation);
        webContext.enableVertexAttribArray(Earth.texPositionAttribLocation);
        webContext.enableVertexAttribArray(Earth.normalPositionAttribLocation);

        // Tell OpenGL state machine which program should be active.
        webContext.useProgram(Earth.program);

        Earth.matWorldUniformLocation = webContext.getUniformLocation(Earth.program, 'worldMatrix');
        Earth.matViewUniformLocation = webContext.getUniformLocation(Earth.program, 'viewMatrix');
        Earth.matProjUniformLocation = webContext.getUniformLocation(Earth.program, 'projectionMatrix');
        
        Earth.shiftUniformLocation = webContext.getUniformLocation(Earth.program, 'shift');
        Earth.lightDirectionUniformLocation = webContext.getUniformLocation(Earth.program, 'lightDirection');

        Earth.worldMatrix = new Float32Array(16);
        Earth.projMatrix = new Float32Array(16);
        GLMF.identity4x4(Earth.worldMatrix);
        GLMF.perspective(Earth.projMatrix, GLMF.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

        webContext.uniformMatrix4fv(Earth.matWorldUniformLocation, webContext.FALSE, Earth.worldMatrix);
        webContext.uniformMatrix4fv(Earth.matProjUniformLocation, webContext.FALSE, Earth.projMatrix);

        Earth.xRotationMatrix = new Float32Array(16);
        Earth.yRotationMatrix = new Float32Array(16);

        Earth.identityMatrix = new Float32Array(16);
        GLMF.identity4x4(Earth.identityMatrix);
        Earth.angle = 0;

        return true;
    }

    static render(webContext, viewMatrix)
    {
        webContext.depthMask(true);
        webContext.enable(webContext.CULL_FACE);

        webContext.useProgram(Earth.program);
		webContext.bindBuffer(webContext.ARRAY_BUFFER, Earth.vertexBufferObject);

		webContext.vertexAttribPointer(
			Earth.positionAttribLocation, // Attribute location
			3, // Number of elements per attribute
			webContext.FLOAT, // Type of elements
			webContext.FALSE,
			8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
			0 // Offset from the beginning of a single vertex to this attribute
		);

        webContext.vertexAttribPointer(
            Earth.texPositionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.vertexAttribPointer(
            Earth.normalPositionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            webContext.FLOAT, // Type of elements
            webContext.FALSE,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex => 3 Vertex-Coords ; 2 Texture-Coords ; 3 Normal-Coords
            5 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        webContext.enableVertexAttribArray(Earth.positionAttribLocation);
		webContext.enableVertexAttribArray(Earth.texPositionAttribLocation);
        webContext.enableVertexAttribArray(Earth.normalPositionAttribLocation);

		Earth.angle = performance.now() / 10000 * Earth.EARTH_SPEED;
		GLMF.rotateY(Earth.worldMatrix, Earth.identityMatrix, Earth.angle);
        GLMF.translate(Earth.worldMatrix, Earth.worldMatrix, [-10, 0, 0]);
        GLMF.scale(Earth.worldMatrix, Earth.worldMatrix, [0.2, 0.2, 0.2]);
		GLMF.rotateY(Earth.worldMatrix, Earth.worldMatrix, performance.now() * 0.0001);
        
        webContext.uniform1f(Earth.shiftUniformLocation, performance.now() * 0.00002);
        webContext.uniform3fv(Earth.lightDirectionUniformLocation, [Earth.worldMatrix[12], Earth.worldMatrix[13], Earth.worldMatrix[14]]);

        webContext.uniformMatrix4fv(Earth.matWorldUniformLocation, webContext.FALSE, Earth.worldMatrix);
        webContext.uniformMatrix4fv(Earth.matViewUniformLocation, webContext.FALSE, viewMatrix);

        webContext.activeTexture(webContext.TEXTURE0);
        webContext.bindTexture(webContext.TEXTURE_2D, Earth.dayTexture);
        webContext.activeTexture(webContext.TEXTURE1);
        webContext.bindTexture(webContext.TEXTURE_2D, Earth.nightTexture);
        webContext.activeTexture(webContext.TEXTURE2);
        webContext.bindTexture(webContext.TEXTURE_2D, Earth.cloudsTexture);

		webContext.drawArrays(webContext.TRIANGLES, 0, Earth.vertices.length / 8);
    }
}