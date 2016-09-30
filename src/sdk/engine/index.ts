
import THREE = require("three");
require("../polyfills");

import { Input } from "../input";
import { Engine } from "./engine";

export { EngineObject } from "./engine";

/**
 * @namespace
 */
export namespace bmacSdk
{
	/**
	 * If set, the game will not update if the window doesn't have focus.
	 * @type {boolean}
	 */
	var CFG_PAUSE_WHEN_UNFOCUSED: boolean = false;
	
	/**
	 * Used to ignore large frame delta after focusin
	 * @type {boolean}
	 */
	var _eatFrame: boolean = false;

	/**
	 * Read-only. Set if window or document was not found.
	 * @type {boolean}
	 */
	export var isHeadless: boolean = false;
	
	/**
	 * Set to true if the window has focus.
	 * @type {boolean}
	 */
	export var isFocused: boolean = true;

	export var domAttached: boolean = false;

	/**
	 * Multiplier to apply to the delta time. Higher values make the game move faster.
	 * @type {number}
	 */
	export var timeScale: number = 1;
	
	/**
	 * Gets the elapsed time since the last frame (in seconds).
	 * @type {number}
	 */
	export function getDeltaSec(): number
	{
		return _deltaSec * timeScale;
	};
	var _deltaSec: number = 0;

	/**
	 * The time of the last frame.
	 * @type {number}
	 */
	var _lastFrame: number = 0;
	
	/**
	 * List of all active Engines.
	 * @type {Engine[]}
	 */
	var engines: Engine[] = [];

	export function createEngine(canvasDivName: string): Engine
	{
		var engine = new Engine(canvasDivName);
		engines.push(engine);
		return engine;
	}

	/**
	 * Call this once to initialize the SDK.
	 */
	export function initialize()
	{
		isHeadless = typeof window == "undefined" || typeof document == "undefined";

		if (!isHeadless)
		{
			if (document.readyState !== "loading")
			{
				_attachDom();
			}
			else
			{
				window.onload = document.onload = function() { _attachDom(); };
			}

			window.addEventListener("blur", function(){
				isFocused = false;
			});

			window.addEventListener("focus",function(){
				isFocused = true;
				_eatFrame = true;
			});
			
			window.addEventListener("resize", function(){
				if (domAttached)
				{
					for (var c = 0; c < engines.length; c++)
					{
						engines[c]._handleWindowResize();
					}
				}
			});
		}
	};

	/**
	 * Call this from onload of the body element. Initializes all engines.
	 */
	export function _attachDom()
	{
		if (domAttached) return;

		console.log("bmacSdk: DOM attached");
		domAttached = true;
		
		for (var c = 0; c < engines.length; c++)
		{
			engines[c]._attachDom();
		}
		
		Input._init();
		
		_lastFrame = Date.now();
		_animate();
	};

	/**
	 * Shut down the SDK.
	 */
	export function destroy()
	{
		Input._destroy();

		//TODO: destroy all engines

		//TODO: stop the animate loop
	};

	/**
	 * Main update loop.
	 */
	function _animate()
	{
		_deltaSec = (Date.now() - _lastFrame) / 1000;
		_lastFrame = Date.now();
		
		// node server doesn't have this method and needs to call this manually each frame
		if (!isHeadless)
		{
			requestAnimationFrame(_animate);
		}
		
		if (_eatFrame)
		{
			_eatFrame = false;
			return;
		}
		
		if (CFG_PAUSE_WHEN_UNFOCUSED && !bmacSdk.isFocused)
		{
			return;
		}
		
		Input._update();
		
		for (var c = 0; c < engines.length; c++)
		{
			engines[c]._animate();
		}
	};
};
