async function InitSpace()
{
	let canvas = Utils.createCanvas('spaceCanvas');

	if(!canvas)
	{
		console.log('ERROR: Canvas not found!');
		return;
	}

	let webContext = Utils.getContext(canvas);

	if(!webContext)
	{
		console.log('ERROR: WebGL not found!');
		return;
	}

	webContext.blendColor(0.0, 0.0, 0.0, 0.7);
	webContext.clearColor(0.062, 0.086, 0.278, 1.000);
	webContext.clear(webContext.COLOR_BUFFER_BIT | webContext.DEPTH_BUFFER_BIT);
	webContext.blendEquationSeparate(webContext.FUNC_ADD, webContext.FUNC_ADD);
	webContext.blendFuncSeparate(webContext.SRC_ALPHA, webContext.ONE_MINUS_SRC_ALPHA, webContext.ONE, webContext.ONE);
	webContext.enable(webContext.DEPTH_TEST);
	webContext.frontFace(webContext.CCW);
	webContext.cullFace(webContext.BACK);
	webContext.viewport(0, 0, window.innerWidth, window.innerHeight);

	//!
	//! --- PLAY VIDEOS AND AUDIOS (ONLY ON CHROME) --- !\\
	//!

	if(!!window.chrome)
	{
		//! --- AUDIO --- !\\
		let atmospheric = document.getElementById('atmospheric');
		atmospheric.volume = 0.15;
		atmospheric.play();

		//! --- VIDEO --- !\\
		document.getElementById('hologram').play();
	}

	//!
	//! --- INITIALIZE THE COMPONENTS --- !\\
	//!

	if(!await Skybox.init(webContext, canvas))
	{
		console.log('ERROR: Program ist null! [Skybox]');
		return;
	}

	if(!await Sun.init(webContext, canvas))
	{
		console.log('ERROR: Program ist null! [Sun]');
		return;
	}

	if(!await Earth.init(webContext, canvas))
	{
		console.log('ERROR: Program ist null! [Earth]');
		return;
	}

	if(!await ForceField.init(webContext, canvas))
	{
		console.log('ERROR: Program ist null! [ForceField]');
		return;
	}

	if(!await Spaceship.init(webContext, canvas))
	{
		console.log('ERROR: Program ist null! [Spaceship]');
		return;
	}

	if(!await Hologram.init(webContext, canvas))
	{
		console.log('ERROR: Program ist null! [Hologram]');
		return;
	}

	if(!await TeapotItem.init(webContext, canvas))
	{
		console.log('ERROR: Program ist null! [TeapotItem]');
		return;
	}

	if(!await MugItem.init(webContext, canvas))
	{
		console.log('ERROR: Program ist null! [MugItem]');
		return;
	}

	if(!await MugItem2.init(webContext, canvas))
	{
		console.log('ERROR: Program ist null! [MugItem2]');
		return;
	}

	if(!await CupItem.init(webContext, canvas))
	{
		console.log('ERROR: Program ist null! [CupItem]');
		return;
	}

	//!
	//! --- CREATE AND MODIFY GLOBAL VIEWMATRIX --- !\\
	//!
	let viewMatrix = new Float32Array(16);
	GLMF.lookAt(viewMatrix, [0, 0, -14], [0, 0, 0], [0, 1, 0]);

	let keyboardTranslationVec3 = [0.0, 0.0, 0.0];
	let keyboardRotationAngle = 0.0;

	var loop = function()
	{
		keyboardTranslationVec3 = [0.0, 0.0, 0.0];
		keyboardRotationAngle = 0.0;

		if(!Utils.DEAD)
		{
			keyboardTranslationVec3 = Input.getAWSD();
			keyboardRotationAngle = Input.getQE();
		}


		//!
		//! --- RENDER SKYBOX --- !\\
		//!

		Skybox.render(webContext, viewMatrix);

		//!
		//! --- RENDER SUN --- !\\
		//!

		Sun.render(webContext, viewMatrix);

		//!
		//! --- RENDER EARTH --- !\\
		//!

		Earth.render(webContext, viewMatrix);

		//!
		//! --- RENDER FORCEFIELD --- !\\
		//!

		ForceField.render(webContext, viewMatrix);

		//!
		//! --- RENDER SPACESHIP --- !\\
		//!

		Spaceship.render(webContext, viewMatrix);

		//!
		//! --- RENDER HOLOGRAM --- !\\
		//!

		Hologram.render(webContext);

		//!
		//! --- RENDER TEAPOTITEM --- !\\
		//!

		TeapotItem.render(webContext, viewMatrix);

		//!
		//! --- RENDER MUGITEM --- !\\
		//!

		MugItem.render(webContext, viewMatrix);

		//!
		//! --- RENDER MUGITEM2 --- !\\
		//!

		MugItem2.render(webContext, viewMatrix);

		//!
		//! --- RENDER CUPITEM --- !\\
		//!

		CupItem.render(webContext, viewMatrix);
		
		//!
		//! --- UPDATE DATA --- !\\
		//!

		//? VIEWMATRIX
		Utils.updateViewMatrix(viewMatrix, keyboardTranslationVec3, keyboardRotationAngle);

		//? TEXTS
		Utils.updateCoordinates(viewMatrix);
		Utils.updateRotation(viewMatrix);
		Utils.updateTime();
		Utils.updateTemperature(viewMatrix);
		Utils.checkDeath(viewMatrix);

		requestAnimationFrame(loop);
	};

	if(Utils.loadAndSetSkyboxImages(webContext))
	{
		loop();
	}

	document.addEventListener('keydown', Input.onKeyDown, false);
	document.addEventListener('keyup', Input.onKeyUp, false);
};