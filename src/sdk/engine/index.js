
THREE = require("three");

require("../polyfills");
Input = require("../input");

/**
 * @namespace
 */
module.exports = bmacSdk =
{
	/**
	 * If set, the game will not update if the window doesn't have focus.
	 * @type {Boolean}
	 */
	CFG_PAUSE_WHEN_UNFOCUSED: false,
	
	/**
	 * Used to ignore large frame delta after focusin
	 * @type {Boolean}
	 */
	_eatFrame: false,
	
	/**
	 * Set to true if the window has focus.
	 * @type {Boolean}
	 */
	isFocused: true,

	domAttached: false,

	/**
	 * Multiplier to apply to the delta time. Higher values make the game move faster.
	 * @type {Number}
	 */
	timeScale: 1,
	
	/**
	 * Gets the elapsed time since the last frame (in seconds).
	 * @type {Number}
	 */
	get deltaSec()
	{
		return this._deltaSec * this.timeScale;
	},
	_deltaSec: 0,
	
	/**
	 * List of all active Engines.
	 * @type {Array}
	 */
	engines: [],

	Engine: require("./engine.js"),
};

/**
 * Call this once to initialize the SDK.
 */
bmacSdk.initialize = function()
{
	window.onblur = document.onfocusout = function()
	{
		bmacSdk.isFocused = false;
	};
	window.onfocus = document.onfocusin = function()
	{
		bmacSdk.isFocused = true;
		bmacSdk._eatFrame = true;
	};
	window.addEventListener("resize", function()
	{
		if (bmacSdk.domAttached)
		{
			for (var c = 0; c < bmacSdk.engines.length; c++)
			{
				bmacSdk.engines[c]._handleWindowResize();
			}
		}
	});
}

/**
 * Call this from onload of the body element. Initializes all engines.
 */
bmacSdk._attachDom = function()
{
	this.domAttached = true;
	
	for (var c = 0; c < bmacSdk.engines.length; c++)
	{
		bmacSdk.engines[c]._attachDom();
	}
	
	Input._init();
	
	this._lastFrame = Date.now();
	this._animate();
};

/**
 * Shut down the SDK.
 */
bmacSdk.destroy = function()
{
	Input._destroy();

	//TODO: destroy all engines

	//TODO: stop the animate loop
}

/**
 * Main update loop.
 */
bmacSdk._animate = function()
{
	bmacSdk._deltaSec = (Date.now() - bmacSdk._lastFrame) / 1000;
	bmacSdk._lastFrame = Date.now();
	
	requestAnimationFrame(bmacSdk._animate);
	
	if (bmacSdk._eatFrame)
	{
		bmacSdk._eatFrame = false;
		return;
	}
	
	if (bmacSdk.CFG_PAUSE_WHEN_UNFOCUSED && !bmacSdk.isFocused)
	{
		return;
	}
	
	Input._update();
	
	for (var c = 0; c < bmacSdk.engines.length; c++)
	{
		bmacSdk.engines[c]._animate();
	}
};
