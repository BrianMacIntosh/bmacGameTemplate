
export namespace Keyboard
{
	/**
	 * Read-only. Set if 'document' was not found.
	 * @type {boolean}
	 */
	export var isHeadless = false;

	//stores current button state
	var keysDown: { [s: string]: boolean } = {};
	
	//buffers button changes for one frame
	var keysPressed: { [s: string]: boolean } = {};
	var keysReleased: { [s: string]: boolean } = {};
	var keysPressedBuffer: { [s: string]: boolean } = {};
	var keysReleasedBuffer: { [s: string]: boolean } = {};

	export enum Key
	{
		Left	= 37,
		Up		= 38,
		Right	= 39,
		Down	= 40,
		Space	= 32,
		PageUp	= 33,
		PageDown= 34,
		Tab		=  9,
		Escape	= 27,
		Enter	= 13,
		Shift	= 16,
		Ctrl	= 17,
		Alt		= 18,
	}

	/**
	 * Called by the SDK to initialize keyboard listening.
	 */
	export function _init()
	{
		if (typeof document !== "undefined")
		{
			document.addEventListener("keydown", _onKeyDown, false);
			document.addEventListener("keyup", _onKeyUp, false);
		}
		else
		{
			isHeadless = true;
		}
	};

	/**
	 * Called by the SDK to stop keyboard listening.
	 */
	export function _destroy()
	{
		if (typeof document !== "undefined")
		{
			document.removeEventListener("keydown", _onKeyDown, false);
			document.removeEventListener("keyup", _onKeyUp, false);
		}
	};

	/**
	 * Called each frame by the SDK.
	 */
	export function _update()
	{
		//cycle buffers
		var temp = keysPressed;
		keysPressed = keysPressedBuffer;
		keysPressedBuffer = temp;
		var temp = keysReleased;
		keysReleased = keysReleasedBuffer;
		keysReleasedBuffer = temp;
		
		//clear new buffer
		for (var i in keysPressedBuffer)
		{
			keysPressedBuffer[i] = false;
		}
		for (var i in keysReleasedBuffer)
		{
			keysReleasedBuffer[i] = false;
		}
		
		//update button down states
		for (var i in keysPressed)
		{
			//ignore repeats
			if (keysDown[i])
				keysPressed[i] = false;
			else if (keysPressed[i] && !keysReleased[i])
				keysDown[i] = true;
		}
		for (var i in keysReleased)
		{
			//ignore repeats
			if (!keysDown[i])
				keysReleased[i] = false;
			else if (keysReleased[i] && !keysPressed[i])
				keysDown[i] = false;
		}
	};

	function _onKeyDown(e)
	{
		e = e || window.event;
		keysPressedBuffer[e.keyCode] = true;
		
		// prevent scrolling
		if (e.keyCode == Key.Space)
		{
			e.preventDefault();
			return false;
		}
		else
		{
			return true;
		}
	};

	function _onKeyUp(e)
	{
		e = e || window.event;
		keysReleasedBuffer[e.keyCode] = true;
	};

	function _translateKey(code: string|Key|number): number
	{
		if (typeof code == 'string')
		{
			return (code as string).toUpperCase().charCodeAt(0);
		}
		else
		{
			return (code as number);
		}
	};

	/**
	 * Returns true on the first frame the specified key is pressed.
	 * @param {string|Key} code A character or a key scancode (see constant definitions).
	 * @returns {boolean}
	 */
	export function keyPressed(code: string|Key): boolean
	{
		return !!keysPressed[_translateKey(code)];
	};

	/**
	 * Returns true on the first frame the specified key is released.
	 * @param {string|Key} code A character or a key scancode (see constant definitions).
	 * @returns {boolean}
	 */
	export function keyReleased(code: string|Key): boolean
	{
		return !!keysReleased[_translateKey(code)];
	};

	/**
	 * Returns true if the specified key is down.
	 * @param {string|Key} code A character or a key scancode (see constant definitions).
	 * @returns {boolean}
	 */
	export function keyDown(code: string|Key): boolean
	{
		return !!keysDown[_translateKey(code)];
	};

	/**
	 * Returns true if the specified key is not down.
	 * @param {string|Key} code A character or a key scancode (see constant definitions).
	 * @returns {boolean}
	 */
	export function keyUp(code: string|Key): boolean
	{
		return !keysDown[_translateKey(code)];
	};

	/**
	 * Returns the number key pressed this frame, or -1 if none.
	 * @returns {number}
	 */
	export function getNumberPressed(): number
	{
		for (var i = 48; i <= 57; i++)
		{
			if (keyPressed(i)) return i - 48;
		}
		return -1;
	};
};
