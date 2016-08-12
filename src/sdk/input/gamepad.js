
module.exports = Gamepad =
{
	/**
	 * Read-only. Set if gamepad data was not found.
	 * @type {Boolean}
	 */
	isHeadless: false,

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

	_init: function()
	{

	},

	_update: function()
	{
		if (typeof navigator !== "undefined" && navigator.getGamepads)
		{
			//HACK: so much garbage
			this.oldGamepads = this._cloneGamepadState(this.gamepads);
			this.gamepads = this._cloneGamepadState(navigator.getGamepads());
		}
		else
		{
			this.oldGamepads = undefined;
			this.gamepads = undefined;
			this.isHeadless = true;
		}
	},

	_destroy: function()
	{

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
	buttonPressed: function(index, button)
	{
		return this.buttonDown(index, button) && !this._buttonDownOld(index, button);
	},

	/**
	 * Returns true on the frame the specified gamepad releases the specified button.
	 * @param {Number} index Gamepad index.
	 * @param {Number} button See constant definitions.
	 */
	buttonReleased: function(index, button)
	{
		return this.buttonUp(index, button) && !this._buttonUpOld(index, button);
	},

	/**
	 * Returns true if the specified button on the specified gamepad is not down.
	 * @param {Number} index Gamepad index.
	 * @param {Number} button See constant definitions.
	 */
	buttonUp: function(index, button)
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
	buttonDown: function(index, button)
	{
		if (this.gamepads && this.gamepads[index] && this.gamepads[index].buttons.length > button)
			return this.gamepads[index].buttons[button].pressed;
		else
			return false;
	},

	_buttonUpOld: function(index, button)
	{
		if (this.oldGamepads && this.oldGamepads[index] && this.oldGamepads[index].buttons.length > button)
			return !this.oldGamepads[index].buttons[button].pressed;
		else
			return false;
	},

	_buttonDownOld: function(index, button)
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
	buttonValue: function(index, button)
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
	getAxis: function(index, axisIndex)
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

	_getOldAxis: function(index, axisIndex)
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
	axisPressed: function(index, axisIndex)
	{
		if (this._getOldAxis(index, axisIndex) < this.STICK_THRESHOLD && this.getAxis(index, axisIndex) >= this.STICK_THRESHOLD)
			return 1;
		else if (this._getOldAxis(index, axisIndex) > -this.STICK_THRESHOLD && this.getAxis(index, axisIndex) <= -this.STICK_THRESHOLD)
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
}