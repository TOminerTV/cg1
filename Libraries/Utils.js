class Utils
{
    static SKYBOX_TEXTURE = null;
    static DEAD = false;

    //!
	//! --- INITIALIZATION --- !\\
	//!
    static createCanvas(canvasElement)
    {
        let canvas = document.getElementById(canvasElement);
    
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        return canvas;
    }

    static getContext(canvas)
    {
        let webContext = canvas.getContext('webgl');

        if(!webContext)
        {
            console.log('WebGL wird nicht unterstützt, \"experimental-webgl\" wird nun genutzt ...');
            webContext = canvas.getContext('experimental-webgl');
        }

        if(!webContext)
        {
            alert('Dein Browser unterstützt kein WebGL :(');
        }

        return webContext;
    }


    //!
	//! --- LOADING --- !\\
	//!
    static async getContentOfFileLocation(location)
    {
        let file = await fetch(location);

        if(!file.ok)
        {
            console.error('File not found! [' + location + ']');
            
            return null;
        }

        let content = await file.text();

        return content;
    }

    static async loadOBJ(location)
    {
        let objFileContent = await Utils.getContentOfFileLocation(location);
	    let objLineArray = objFileContent.split(/\r*\n/);

        let verticesArray = [];
        let vertexTextureCoordsArray = [];
        let vertexNormalsArray = [];

        let totalVerticesArray = [];

        for(let line of objLineArray)
        {
            let lineArray = line.trim().split(' ');
            let vertexType = lineArray.shift();

            if(vertexType === 'v')
            {
                verticesArray = verticesArray.concat(lineArray.map(parseFloat));
            }
            else if(vertexType === 'vt')
            {
                vertexTextureCoordsArray = vertexTextureCoordsArray.concat(lineArray.map(parseFloat));
            }
            else if(vertexType === 'vn')
            {
                vertexNormalsArray = vertexNormalsArray.concat(lineArray.map(parseFloat));
            }
            else if(vertexType === 'f')
            {
                for(let triangleDataCoords of lineArray)
                {
                    let vertexData = triangleDataCoords.split('/').map(value => parseInt(value));

                    let vertArrayCoord = (vertexData[0] - 1) * 3;
                    totalVerticesArray.push(verticesArray[vertArrayCoord]);
                    totalVerticesArray.push(verticesArray[vertArrayCoord + 1]);
                    totalVerticesArray.push(verticesArray[vertArrayCoord + 2]);

                    let texArrayCoord = (vertexData[1] - 1) * 2;
                    totalVerticesArray.push(vertexTextureCoordsArray[texArrayCoord]);
                    totalVerticesArray.push(vertexTextureCoordsArray[texArrayCoord + 1]);

                    let normalArrayCoord = (vertexData[2] - 1) * 3;
                    totalVerticesArray.push(vertexNormalsArray[normalArrayCoord]);
                    totalVerticesArray.push(vertexNormalsArray[normalArrayCoord + 1]);
                    totalVerticesArray.push(vertexNormalsArray[normalArrayCoord + 2]);
                }
            }
        }

        return totalVerticesArray;
    }

    static async loadAndSetSkyboxImages(webContext)
    {
        await Promise.all([
            document.getElementById('skyboxRight'),
            document.getElementById('skyboxLeft'),
            document.getElementById('skyboxUp'),
            document.getElementById('skyboxDown'),
            document.getElementById('skyboxFront'),
            document.getElementById('skyboxBack')
        ]).then((images) => {
            Utils.SKYBOX_TEXTURE = webContext.createTexture();
            webContext.bindTexture(webContext.TEXTURE_CUBE_MAP, Utils.SKYBOX_TEXTURE);
    
            webContext.texParameteri(webContext.TEXTURE_CUBE_MAP, webContext.TEXTURE_MIN_FILTER, webContext.LINEAR);
            webContext.texParameteri(webContext.TEXTURE_CUBE_MAP, webContext.TEXTURE_MAG_FILTER, webContext.LINEAR);
            webContext.texParameteri(webContext.TEXTURE_CUBE_MAP, webContext.TEXTURE_WRAP_S, webContext.CLAMP_TO_EDGE);
            webContext.texParameteri(webContext.TEXTURE_CUBE_MAP, webContext.TEXTURE_WRAP_T, webContext.CLAMP_TO_EDGE);

            webContext.pixelStorei(webContext.UNPACK_FLIP_Y_WEBGL, false);

            images.forEach((image, index) => {
                webContext.texImage2D(webContext.TEXTURE_CUBE_MAP_POSITIVE_X + index, 0, webContext.RGBA, webContext.RGBA, webContext.UNSIGNED_BYTE, image);
            });

            return true;
        });

        return false;
    }


    //!
	//! --- CREATION --- !\\
	//!
    static async createShader(webContext, type, location)
    {
        let shaderFile = await Utils.getContentOfFileLocation(location);
        let shader = webContext.createShader(type);

        webContext.shaderSource(shader, shaderFile);
        webContext.compileShader(shader);

        if(!webContext.getShaderParameter(shader, webContext.COMPILE_STATUS))
        {
            console.error('ERROR: ' + Utils.getWebGLTypeAsText(type) + ' cant be compiled!', webContext.getShaderInfoLog(shader));
            
            return null;
        }

        return shader;
    }

    static async createProgram(webContext, vertexShaderLocation, fragmentShaderLocation)
    {
        let vertexShader = await Utils.createShader(webContext, webContext.VERTEX_SHADER, vertexShaderLocation);
        let fragmentShader = await Utils.createShader(webContext, webContext.FRAGMENT_SHADER, fragmentShaderLocation);

        let program = webContext.createProgram();
        webContext.attachShader(program, vertexShader);
        webContext.attachShader(program, fragmentShader);
        
        webContext.linkProgram(program);
        if(!webContext.getProgramParameter(program, webContext.LINK_STATUS))
        {
            console.error('ERROR: Program cant be linked!', webContext.getProgramInfoLog(program));

            return null;
        }
        
        webContext.validateProgram(program);
        if(!webContext.getProgramParameter(program, webContext.VALIDATE_STATUS))
        {
            console.error('ERROR: Program cant be validated!', webContext.getProgramInfoLog(program));

            return null;
        }

        webContext.useProgram(program);

        return program;
    }


    //!
	//! --- CONVERSION --- !\\
	//!
    static getWebGLTypeAsText(webGLType)
    {
        switch(webGLType)
        {
            case 35632:
                return 'Fragment-Shader';

            case 35633:
                return 'Vertex-Shader';
        }
    }

    static hexToRgb1()
    {

    }

    static rgb255ToRgb1(r, g, b)
    {
        return [r / 255, g / 255, b / 255];
    }


    //!
	//! --- UPDATE --- !\\
	//!

    static updateViewMatrix(viewMatrix, keyboardTranslationVec3, keyboardRotationAngle)
    {
        if(keyboardTranslationVec3 || keyboardRotationAngle)
        {
            GLMF.translate(viewMatrix, viewMatrix, keyboardTranslationVec3);
            GLMF.rotateY(viewMatrix, viewMatrix, keyboardRotationAngle);
        }
    }

    static updateCoordinates(viewMatrix)
    {
        document.getElementById('coordinates').innerHTML = viewMatrix[12].toFixed(2) + ' / ' + viewMatrix[13].toFixed(2) + ' / ' + viewMatrix[14].toFixed(2);
    }

    static updateRotation(viewMatrix)
    {
        document.getElementById('rotation').innerHTML = (Math.acos(viewMatrix[0]) * 180 / Math.PI).toFixed(2) + '°';
    }

    static updateTime()
    {
        let timeInSeconds = (performance.now() / 1000).toFixed(0);
        
        let seconds = timeInSeconds % 60;
        let minutes = Math.floor(timeInSeconds / 60);

        document.getElementById('time').innerHTML = ('0' + minutes).slice(-2) + 'm ' + ('0' + seconds).slice(-2) + 's';
    }

    static updateTemperature(viewMatrix)
    {
        document.getElementById('temperature').innerHTML = (Math.abs(1 / viewMatrix[14]) * 6000).toFixed(0) + ' °C';
    }

    static checkDeath(viewMatrix)
    {
        if(viewMatrix[12] < 2.2 && viewMatrix[12] > -2.2 && viewMatrix[14] < 4.0 && viewMatrix[14] > -4.0)
        {
            Utils.DEAD = true;
            document.getElementById('deathSentence').style.display = 'block';
        }
    }
}