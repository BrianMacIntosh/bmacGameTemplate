
export namespace Gamepad
{
	/**
	 * Read-only. Set if gamepad data was not found.
	 * @type {boolean}
	 */
	export var isHeadless = false;

	var STICK_THRESHOLD = 0.5;
	var DEAD_ZONE = 0.3;

	export enum Button
	{
		A = 0,
		B = 1,
		X = 2,
		Y = 3,
		LeftShoulder = 4,
		RightShoulder = 5,
		LeftTrigger = 6,
		RightTrigger = 7,
		Back = 8,
		Start = 9,
		LeftStick = 10,
		RightStic = 11,
		DPadUp = 12,
		DPadDown = 13,
		DPadLeft = 14,
		DPadRight = 15,
		Home = 16,
	}
	
	export enum Axis
	{
		LeftStickX = 0,
		LeftStickY = 1,
		RightStickX = 2,
		RightStickY = 3,
	}

	var gamepads: Gamepad[];
	var oldGamepads: Gamepad[];

	export function _init()
	{

	};

	export function _update()
	{
		if (typeof navigator !== "undefined" && navigator.getGamepads)
		{
			//HACK: so much garbage
			oldGamepads = _cloneGamepadState(gamepads);
			gamepads = _cloneGamepadState(navigator.getGamepads());
		}
		else
		{
			oldGamepads = undefined;
			gamepads = undefined;
			isHeadless = true;
		}
	};

	export function _destroy()
	{

	};

	/**
	 * Gets raw information for the gamepad at the specified index.
	 * @param {number} index Gamepad index.
	 */
	export function getGamepad(index: number): Gamepad
	{
		if (gamepads && gamepads[index])
			return gamepads[index];
		else
			return null;
	};

	/**
	 * Returns true if there is a gamepad at the specified index.
	 * @param {number} index Gamepad index.
	 * @returns {boolean}
	 */
	export function gamepadExists(index: number): boolean
	{
		if (gamepads && gamepads[index])
			return true;
		else
			return false;
	};

	/**
	 * Returns true if there is a connected gamepad at the specified index.
	 * @param {number} index Gamepad index.
	 * @returns {boolean}
	 */
	export function gamepadConnected(index: number): boolean
	{
		if (gamepads && gamepads[index] && gamepads[index].connected)
			return true;
		else
			return false;
	};

	/**
	 * Returns true on the frame the specified gamepad presses the specified button.
	 * @param {number} index Gamepad index.
	 * @param {number} button See constant definitions.
	 */
	export function buttonPressed(index: number, button: Button): boolean
	{
		return buttonDown(index, button) && !_buttonDownOld(index, button);
	};

	/**
	 * Returns true on the frame the specified gamepad releases the specified button.
	 * @param {number} index Gamepad index.
	 * @param {number} button See constant definitions.
	 */
	export function buttonReleased(index: number, button: Button): boolean
	{
		return buttonUp(index, button) && !_buttonUpOld(index, button);
	};

	/**
	 * Returns true if the specified button on the specified gamepad is not down.
	 * @param {number} index Gamepad index.
	 * @param {number} button See constant definitions.
	 */
	export function buttonUp(index: number, button: Button): boolean
	{
		if (gamepads && gamepads[index] && gamepads[index].buttons.length > button)
			return !gamepads[index].buttons[button].pressed;
		else
			return false;
	};

	/**
	 * Returns true if the specified button on the specified gamepad is down.
	 * @param {number} index Gamepad index.
	 * @param {number} button See constant definitions.
	 */
	export function buttonDown(index: number, button: Button): boolean
	{
		if (gamepads && gamepads[index] && gamepads[index].buttons.length > button)
			return gamepads[index].buttons[button].pressed;
		else
			return false;
	};

	function _buttonUpOld(index: number, button: Button): boolean
	{
		if (oldGamepads && oldGamepads[index] && oldGamepads[index].buttons.length > button)
			return !oldGamepads[index].buttons[button].pressed;
		else
			return false;
	};

	function _buttonDownOld(index: number, button: Button): boolean
	{
		if (oldGamepads && oldGamepads[index] && oldGamepads[index].buttons.length > button)
			return oldGamepads[index].buttons[button].pressed;
		else
			return false;
	};

	/**
	 * Returns the raw value of the specified gamepad button.
	 * @param {number} index Gamepad index.
	 * @param {number} button See constant definitions.
	 */
	export function buttonValue(index: number, button: Button): number
	{
		if (gamepads && gamepads[index] && gamepads[index].buttons.length > button)
			return gamepads[index].buttons[button].value;
		else
			return 0;
	};

	/**
	 * Returns the value of the specified gamepad axis.
	 * @param {number} index Gamepad index.
	 * @param {number} axisIndex See constant definitions.
	 */
	export function getAxis(index: number, axisIndex: Axis): number
	{
		if (gamepads && gamepads[index] && gamepads[index].axes.length > axisIndex)
		{
			var val = gamepads[index].axes[axisIndex];
			if (Math.abs(val) <= DEAD_ZONE) val = 0;
			return val;
		}
		else
			return 0;
	};

	function _getOldAxis(index: number, axisIndex: Axis): number
	{
		if (oldGamepads && oldGamepads[index] && oldGamepads[index].axes.length > axisIndex)
		{
			var val = oldGamepads[index].axes[axisIndex];
			if (Math.abs(val) <= DEAD_ZONE) val = 0;
			return val;
		}
		else
			return 0;
	};

	/**
	 * Returns 1 or -1 on the first frame the specified axis is pressed in that direction, or 0 if it isn't pressed.
	 * @param {number} index Gamepad index.
	 * @param {number} axisIndex See constant definitions.
	 */
	export function axisPressed(index: number, axisIndex: Axis): number
	{
		if (_getOldAxis(index, axisIndex) < STICK_THRESHOLD && getAxis(index, axisIndex) >= STICK_THRESHOLD)
			return 1;
		else if (_getOldAxis(index, axisIndex) > -STICK_THRESHOLD && getAxis(index, axisIndex) <= -STICK_THRESHOLD)
			return -1;
		else
			return 0;
	};

	function _cloneGamepadState(source: Gamepad[]): Gamepad[]
	{
		if (!source) return null;
		
		var target = [];
		target.length = source.length;
		for (var i = 0; i < source.length; i++)
		{
			if (source[i])
			{
				var gamepad = source[i];
				var state: Gamepad = {} as Gamepad;
				state.buttons = [];
				state.buttons.length = gamepad.buttons.length;
				state.axes = [];
				for (var a = 0; a < gamepad.axes.length; a++)
				{
					state.axes[a] = gamepad.axes[a];
				}
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
	};
}
