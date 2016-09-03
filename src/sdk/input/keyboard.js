
module.exports = Keyboard =
{
	/**
	 * Read-only. Set if 'document' was not found.
	 * @type {Boolean}
	 */
	isHeadless: false,

	//stores current button state
	keysDown: {},
	
	//buffers button changes for one frame
	keysPressed: {},
	keysReleased: {},
	keysPressedBuffer: {},
	keysReleasedBuffer: {},

	LEFT	: 37,
	UP		: 38,
	RIGHT	: 39,
	DOWN	: 40,
	SPACE	: 32,
	PGUP	: 33,
	PGDOWN	: 34,
	TAB		:  9,
	ESCAPE	: 27,
	ENTER	: 13,
	SHIFT	: 16,
	CTRL	: 17,
	ALT		: 18,

	/**
	 * Called by the SDK to initialize keyboard listening.
	 */
	_init: function()
	{
		//create callbacks
		var self = this;
		this._onKeyDown = function(e)
		{
			e = e || window.event;
			self.keysPressedBuffer[e.keyCode] = true;
			
			// prevent scrolling
			if (e.keyCode == Keyboard.SPACE)
			{
				e.preventDefault();
				return false;
			}
		};
		this._onKeyUp = function(e)
		{
			e = e || window.event;
			self.keysReleasedBuffer[e.keyCode] = true;
		};
		
		if (typeof document !== "undefined")
		{
			document.addEventListener("keydown", this._onKeyDown, false);
			document.addEventListener("keyup", this._onKeyUp, false);
		}
		else
		{
			this.isHeadless = true;
		}
	},

	/**
	 * Called by the SDK to stop keyboard listening.
	 */
	_destroy: function()
	{
		if (typeof document !== "undefined")
		{
			document.removeEventListener("keydown", this._onKeyDown, false);
			document.removeEventListener("keyup", this._onKeyUp, false);
		}
	},

	/**
	 * Called each frame by the SDK.
	 */
	_update: function()
	{
		//cycle buffers
		var temp = this.keysPressed;
		this.keysPressed = this.keysPressedBuffer;
		this.keysPressedBuffer = temp;
		var temp = this.keysReleased;
		this.keysReleased = this.keysReleasedBuffer;
		this.keysReleasedBuffer = temp;
		
		//clear new buffer
		for (var i in this.keysPressedBuffer)
		{
			this.keysPressedBuffer[i] = false;
		}
		for (var i in this.mouseReleasedBuffer)
		{
			this.keysReleasedBuffer[i] = false;
		}
		
		//update button down states
		for (var i in this.keysPressed)
		{
			//ignore repeats
			if (this.keysDown[i])
				this.keysPressed[i] = false;
			else if (this.keysPressed[i] && !this.keysReleased[i])
				this.keysDown[i] = true;
		}
		for (var i in this.keysReleased)
		{
			//ignore repeats
			if (!this.keysDown[i])
				this.keysReleased[i] = false;
			else if (this.keysReleased[i] && !this.keysPressed[i])
				this.keysDown[i] = false;
		}
	},

	_translateKey: function(code)
	{
		if (typeof code == 'string' || code instanceof String)
			return code.toUpperCase().charCodeAt(0);
		else
			return code;
	},

	/**
	 * Returns true on the first frame the specified key is pressed.
	 * @param {any} code A character or a key scancode (see constant definitions).
	 * @returns {Boolean}
	 */
	keyPressed: function(code)
	{
		return !!this.keysPressed[this._translateKey(code)];
	},

	/**
	 * Returns true on the first frame the specified key is released.
	 * @param {any} code A character or a key scancode (see constant definitions).
	 * @returns {Boolean}
	 */
	keyReleased: function(code)
	{
		return !!this.keysReleased[this._translateKey(code)];
	},

	/**
	 * Returns true if the specified key is down.
	 * @param {any} code A character or a key scancode (see constant definitions).
	 * @returns {Boolean}
	 */
	keyDown: function(code)
	{
		return !!this.keysDown[this._translateKey(code)];
	},

	/**
	 * Returns true if the specified key is not down.
	 * @param {any} code A character or a key scancode (see constant definitions).
	 * @returns {Boolean}
	 */
	keyUp: function(code)
	{
		return !this.keysDown[this._translateKey(code)];
	},

	/**
	 * Returns the number key pressed this frame, or -1 if none.
	 * @returns {Number}
	 */
	getNumberPressed: function()
	{
		for (var i = 48; i <= 57; i++)
		{
			if (this.keyPressed(i)) return i - 48;
		}
		return -1;
	}
};
