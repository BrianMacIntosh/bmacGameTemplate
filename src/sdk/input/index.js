
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
};

Input.Keyboard = require("./keyboard.js");
Input.Mouse = require("./mouse.js");

Input.init = function()
{
	this.Keyboard.init();
	this.Mouse.init();
}

Input.actionMenuLeft = function()
{
	return this.Keyboard.keyPressed(this.Keyboard.LEFT) || this.Keyboard.keyPressed("a")
		|| this.gamepadAxisPressed(this.FIRST_PLAYER, this.GA_LEFTSTICK_X) < 0
		|| this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_DPAD_LEFT);
}

Input.actionMenuRight = function()
{
	return this.Keyboard.keyPressed(this.Keyboard.RIGHT) || this.Keyboard.keyPressed("d")
		|| this.gamepadAxisPressed(this.FIRST_PLAYER, this.GA_LEFTSTICK_X) > 0
		|| this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_DPAD_RIGHT);
}

Input.actionMenuUp = function()
{
	return this.Keyboard.keyPressed(this.Keyboard.UP) || this.Keyboard.keyPressed("w")
		|| this.gamepadAxisPressed(this.FIRST_PLAYER, this.GA_LEFTSTICK_Y) < 0
		|| this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_DPAD_UP);
}

Input.actionMenuDown = function()
{
	return this.Keyboard.keyPressed(this.Keyboard.DOWN) || this.Keyboard.keyPressed("s")
		|| this.gamepadAxisPressed(this.FIRST_PLAYER, this.GA_LEFTSTICK_Y) > 0
		|| this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_DPAD_DOWN);
}

Input.actionMenuAccept = function()
{
	return this.Keyboard.keyPressed(this.Keyboard.SPACE) || this.Keyboard.keyPressed(this.Keyboard.ENTER)
		|| this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_A);
}

Input.actionMenuCancel = function()
{
	return this.Keyboard.keyPressed(this.Keyboard.ESCAPE) || this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_B);
}

Input.actionGamePause = function()
{
	return this.Keyboard.keyPressed(this.Keyboard.ESCAPE) || this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_START);
}

Input.getGamepad = function(gamepad)
{
	if (this.gamepads && this.gamepads[gamepad])
		return this.gamepads[gamepad];
	else
		return null;
};

Input.gamepadExists = function(gamepad)
{
	if (this.gamepads && this.gamepads[gamepad])
		return true;
	else
		return false;
};

Input.gamepadConnected = function(gamepad)
{
	if (this.gamepads && this.gamepads[gamepad] && this.gamepads[gamepad].connected)
		return true;
	else
		return false;
};

Input.gamepadButtonPressed = function(gamepad, button)
{
	return this.gamepadButtonDown(gamepad, button) && !this.gamepadButtonDownOld(gamepad, button);
};

Input.gamepadButtonReleased = function(gamepad, button)
{
	return this.gamepadButtonUp(gamepad, button) && !this.gamepadButtonUpOld(gamepad, button);
};

Input.gamepadButtonUp = function(gamepad, button)
{
	if (this.gamepads && this.gamepads[gamepad] && this.gamepads[gamepad].buttons.length > button)
		return !this.gamepads[gamepad].buttons[button].pressed;
	else
		return false;
};

Input.gamepadButtonDown = function(gamepad, button)
{
	if (this.gamepads && this.gamepads[gamepad] && this.gamepads[gamepad].buttons.length > button)
		return this.gamepads[gamepad].buttons[button].pressed;
	else
		return false;
};

Input.gamepadButtonUpOld = function(gamepad, button)
{
	if (this.oldGamepads && this.oldGamepads[gamepad] && this.oldGamepads[gamepad].buttons.length > button)
		return !this.oldGamepads[gamepad].buttons[button].pressed;
	else
		return false;
};

Input.gamepadButtonDownOld = function(gamepad, button)
{
	if (this.oldGamepads && this.oldGamepads[gamepad] && this.oldGamepads[gamepad].buttons.length > button)
		return this.oldGamepads[gamepad].buttons[button].pressed;
	else
		return false;
};

Input.gamepadButtonValue = function(gamepad, button)
{
	if (this.gamepads && this.gamepads[gamepad] && this.gamepads[gamepad].buttons.length > button)
		return this.gamepads[gamepad].buttons[button].value;
	else
		return 0;
};

Input.gamepadAxis = function(gamepad, axis)
{
	if (this.gamepads && this.gamepads[gamepad] && this.gamepads[gamepad].axes.length > axis)
	{
		var val = this.gamepads[gamepad].axes[axis];
		if (Math.abs(val) <= this.DEAD_ZONE) val = 0;
		return val;
	}
	else
		return 0;
};

Input.gamepadOldAxis = function(gamepad, axis)
{
	if (this.oldGamepads && this.oldGamepads[gamepad] && this.oldGamepads[gamepad].axes.length > axis)
	{
		var val = this.oldGamepads[gamepad].axes[axis];
		if (Math.abs(val) <= this.DEAD_ZONE) val = 0;
		return val;
	}
	else
		return 0;
};

Input.gamepadAxisPressed = function(gamepad, axis)
{
	if (this.gamepadOldAxis(gamepad, axis) < this.STICK_THRESHOLD && this.gamepadAxis(gamepad, axis) >= this.STICK_THRESHOLD)
		return 1;
	else if (this.gamepadOldAxis(gamepad, axis) > -this.STICK_THRESHOLD && this.gamepadAxis(gamepad, axis) <= -this.STICK_THRESHOLD)
		return -1;
	else
		return 0;
};

Input.cloneGamepadState = function(source)
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
}

Input.update = function()
{
	if (navigator && navigator.getGamepads)
	{
		//TODO: so much garbage
		this.oldGamepads = this.cloneGamepadState(this.gamepads);
		this.gamepads = this.cloneGamepadState(navigator.getGamepads());
	}
	else
	{
		this.oldGamepads = undefined;
		this.gamepads = undefined;
	}
	
	this.Keyboard.update();
	this.Mouse.update();
}