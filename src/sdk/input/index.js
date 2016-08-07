
module.exports = Input = 
{
	STICK_THRESHOLD: 0.5,
	DEAD_ZONE: 0.3,
	
	GB_A: 0,
	GB_B: 1,
	GB_X: 2,
	GB_Y: 3,
	GB_LEFTSHOULDER: 4,
	GB_RIGHTSHOULDER: 5,
	GB_LEFTTRIGGER: 6,
	GB_RIGHTTRIGGER: 7,
	GB_BACK: 8,
	GB_START: 9,
	GB_LEFTSTICK: 10,
	GB_RIGHTSTICK: 11,
	GB_DPAD_UP: 12,
	GB_DPAD_DOWN: 13,
	GB_DPAD_LEFT: 14,
	GB_DPAD_RIGHT: 15,
	GB_HOME: 16,
	
	GA_LEFTSTICK_X: 0,
	GA_LEFTSTICK_Y: 1,
	GA_RIGHTSTICK_X: 2,
	GA_RIGHTSTICK_Y: 3,
	
	FIRST_PLAYER: 0, //TODO: dynamic

	Keyboard: require("./keyboard.js"),
	Mouse: require("./mouse.js"),

	/**
	 * Called by the SDK to initialize the input system.
	 */
	_init: function()
	{
		this.Keyboard._init();
		this.Mouse._init();
	},

	/**
	 * Called by the SDK to destroy the input system.
	 */
	_destroy: function()
	{
		this.Keyboard._destroy();
		this.Mouse._destroy();
	},

	/**
	 * Returns true if a 'left' control was pressed.
	 * @returns {Boolean}
	 */
	actionMenuLeft: function()
	{
		return this.Keyboard.keyPressed(this.Keyboard.LEFT) || this.Keyboard.keyPressed("a")
			|| this.gamepadAxisPressed(this.FIRST_PLAYER, this.GA_LEFTSTICK_X) < 0
			|| this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_DPAD_LEFT);
	},

	/**
	 * Returns true if a 'right' control was pressed.
	 * @returns {Boolean}
	 */
	actionMenuRight: function()
	{
		return this.Keyboard.keyPressed(this.Keyboard.RIGHT) || this.Keyboard.keyPressed("d")
			|| this.gamepadAxisPressed(this.FIRST_PLAYER, this.GA_LEFTSTICK_X) > 0
			|| this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_DPAD_RIGHT);
	},

	/**
	 * Returns true if an 'up' control was pressed.
	 * @returns {Boolean}
	 */
	actionMenuUp: function()
	{
		return this.Keyboard.keyPressed(this.Keyboard.UP) || this.Keyboard.keyPressed("w")
			|| this.gamepadAxisPressed(this.FIRST_PLAYER, this.GA_LEFTSTICK_Y) < 0
			|| this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_DPAD_UP);
	},

	/**
	 * Returns true if a 'down' control was pressed.
	 * @returns {Boolean}
	 */
	actionMenuDown: function()
	{
		return this.Keyboard.keyPressed(this.Keyboard.DOWN) || this.Keyboard.keyPressed("s")
			|| this.gamepadAxisPressed(this.FIRST_PLAYER, this.GA_LEFTSTICK_Y) > 0
			|| this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_DPAD_DOWN);
	},

	/**
	 * Returns true if an 'accept' control was pressed.
	 * @returns {Boolean}
	 */
	actionMenuAccept: function()
	{
		return this.Keyboard.keyPressed(this.Keyboard.SPACE) || this.Keyboard.keyPressed(this.Keyboard.ENTER)
			|| this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_A);
	},

	/**
	 * Returns true if a 'cancel' control was pressed.
	 * @returns {Boolean}
	 */
	actionMenuCancel: function()
	{
		return this.Keyboard.keyPressed(this.Keyboard.ESCAPE) || this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_B);
	},

	/**
	 * Returns true if a 'pause' control was pressed.
	 * @returns {Boolean}
	 */
	actionGamePause: function()
	{
		return this.Keyboard.keyPressed(this.Keyboard.ESCAPE) || this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_START);
	},

	/**
	 * Gets raw information for the gamepad at the specified index.
	 * @param {Number} index Gamepad index.
	 */
	getGamepad: function(index)
	{
		if (this.gamepads && this.gamepads[index])
			return this.gamepads[index];
		else
			return null;
	},

	/**
	 * Returns true if there is a gamepad at the specified index.
	 * @param {Number} index Gamepad index.
	 * @returns {Boolean}
	 */
	gamepadExists: function(index)
	{
		if (this.gamepads && this.gamepads[index])
			return true;
		else
			return false;
	},

	/**
	 * Returns true if there is a connected gamepad at the specified index.
	 * @param {Number} index Gamepad index.
	 * @returns {Boolean}
	 */
	gamepadConnected: function(index)
	{
		if (this.gamepads && this.gamepads[index] && this.gamepads[index].connected)
			return true;
		else
			return false;
	},

	/**
	 * Returns true on the frame the specified gamepad presses the specified button.
	 * @param {Number} index Gamepad index.
	 * @param {Number} button See constant definitions.
	 */
	gamepadButtonPressed: function(index, button)
	{
		return this.gamepadButtonDown(index, button) && !this._gamepadButtonDownOld(index, button);
	},

	/**
	 * Returns true on the frame the specified gamepad releases the specified button.
	 * @param {Number} index Gamepad index.
	 * @param {Number} button See constant definitions.
	 */
	gamepadButtonReleased: function(index, button)
	{
		return this.gamepadButtonUp(index, button) && !this._gamepadButtonUpOld(index, button);
	},

	/**
	 * Returns true if the specified button on the specified gamepad is not down.
	 * @param {Number} index Gamepad index.
	 * @param {Number} button See constant definitions.
	 */
	gamepadButtonUp: function(index, button)
	{
		if (this.gamepads && this.gamepads[index] && this.gamepads[index].buttons.length > button)
			return !this.gamepads[index].buttons[button].pressed;
		else
			return false;
	},

	/**
	 * Returns true if the specified button on the specified gamepad is down.
	 * @param {Number} index Gamepad index.
	 * @param {Number} button See constant definitions.
	 */
	gamepadButtonDown: function(index, button)
	{
		if (this.gamepads && this.gamepads[index] && this.gamepads[index].buttons.length > button)
			return this.gamepads[index].buttons[button].pressed;
		else
			return false;
	},

	_gamepadButtonUpOld: function(index, button)
	{
		if (this.oldGamepads && this.oldGamepads[index] && this.oldGamepads[index].buttons.length > button)
			return !this.oldGamepads[index].buttons[button].pressed;
		else
			return false;
	},

	_gamepadButtonDownOld: function(index, button)
	{
		if (this.oldGamepads && this.oldGamepads[index] && this.oldGamepads[index].buttons.length > button)
			return this.oldGamepads[index].buttons[button].pressed;
		else
			return false;
	},

	/**
	 * Returns the raw value of the specified gamepad button.
	 * @param {Number} index Gamepad index.
	 * @param {Number} button See constant definitions.
	 */
	gamepadButtonValue: function(index, button)
	{
		if (this.gamepads && this.gamepads[index] && this.gamepads[index].buttons.length > button)
			return this.gamepads[index].buttons[button].value;
		else
			return 0;
	},

	/**
	 * Returns the value of the specified gamepad axis.
	 * @param {Number} index Gamepad index.
	 * @param {Number} axisIndex See constant definitions.
	 */
	gamepadAxis: function(index, axisIndex)
	{
		if (this.gamepads && this.gamepads[index] && this.gamepads[index].axes.length > axisIndex)
		{
			var val = this.gamepads[index].axes[axisIndex];
			if (Math.abs(val) <= this.DEAD_ZONE) val = 0;
			return val;
		}
		else
			return 0;
	},

	_gamepadOldAxis: function(index, axisIndex)
	{
		if (this.oldGamepads && this.oldGamepads[index] && this.oldGamepads[index].axes.length > axisIndex)
		{
			var val = this.oldGamepads[index].axes[axisIndex];
			if (Math.abs(val) <= this.DEAD_ZONE) val = 0;
			return val;
		}
		else
			return 0;
	},

	/**
	 * Returns 1 or -1 on the first frame the specified axis is pressed in that direction, or 0 if it isn't pressed.
	 * @param {Number} index Gamepad index.
	 * @param {Number} axisIndex See constant definitions.
	 */
	gamepadAxisPressed: function(index, axisIndex)
	{
		if (this._gamepadOldAxis(index, axisIndex) < this.STICK_THRESHOLD && this.gamepadAxis(index, axisIndex) >= this.STICK_THRESHOLD)
			return 1;
		else if (this._gamepadOldAxis(index, axisIndex) > -this.STICK_THRESHOLD && this.gamepadAxis(index, axisIndex) <= -this.STICK_THRESHOLD)
			return -1;
		else
			return 0;
	},

	_cloneGamepadState: function(source)
	{
		if (!source) return null;
		
		var target = [];
		target.length = source.length;
		for (var i = 0; i < source.length; i++)
		{
			if (source[i])
			{
				var gamepad = source[i];
				var state = {};
				state.buttons = [];
				state.buttons.length = gamepad.buttons.length;
				state.axes = gamepad.axes.splice(0);
				for (var b = 0; b < gamepad.buttons.length; b++)
				{
					var obj = {pressed:gamepad.buttons[b].pressed, value:gamepad.buttons[b].value};
					state.buttons[b] = obj;
				}
				target[i] = state;
			}
			else
			{
				target[i] = null;
			}
		}
		return target;
	},

	/**
	 * Called by the SDK each frame.
	 */
	_update: function()
	{
		if (navigator && navigator.getGamepads)
		{
			//HACK: so much garbage
			this.oldGamepads = this._cloneGamepadState(this.gamepads);
			this.gamepads = this._cloneGamepadState(navigator.getGamepads());
		}
		else
		{
			this.oldGamepads = undefined;
			this.gamepads = undefined;
		}
		
		this.Keyboard._update();
		this.Mouse._update();
	},
};
