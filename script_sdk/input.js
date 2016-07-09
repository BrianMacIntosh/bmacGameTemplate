
bmacSdk.INPUT = 
{
	STICK_THRESHOLD: 0.3,
	DEAD_ZONE: 0.15,
	
	GB_A: 0,
	GB_B: 1,
	GB_X: 2,
	GB_Y: 3,
	GB_LEFTSHOLDER: 4,
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

bmacSdk.INPUT.init = function()
{
	bmacSdk.KEYBOARD.init();
	bmacSdk.MOUSE.init();
}

bmacSdk.INPUT.actionMenuLeft = function()
{
	return GameEngine.keyboard.keyPressed(bmacSdk.KEYBOARD.LEFT) || GameEngine.keyboard.keyPressed("a")
		|| this.gamepadAxisPressed(this.FIRST_PLAYER, this.GA_LEFTSTICK_X) < 0
		|| this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_DPAD_LEFT);
}

bmacSdk.INPUT.actionMenuRight = function()
{
	return GameEngine.keyboard.keyPressed(bmacSdk.KEYBOARD.RIGHT) || GameEngine.keyboard.keyPressed("d")
		|| this.gamepadAxisPressed(this.FIRST_PLAYER, this.GA_LEFTSTICK_X) > 0
		|| this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_DPAD_RIGHT);
}

bmacSdk.INPUT.actionMenuUp = function()
{
	return GameEngine.keyboard.keyPressed(bmacSdk.KEYBOARD.UP) || GameEngine.keyboard.keyPressed("w")
		|| this.gamepadAxisPressed(this.FIRST_PLAYER, this.GA_LEFTSTICK_Y) < 0
		|| this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_DPAD_UP);
}

bmacSdk.INPUT.actionMenuDown = function()
{
	return GameEngine.keyboard.keyPressed(bmacSdk.KEYBOARD.DOWN) || GameEngine.keyboard.keyPressed("s")
		|| this.gamepadAxisPressed(this.FIRST_PLAYER, this.GA_LEFTSTICK_Y) > 0
		|| this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_DPAD_DOWN);
}

bmacSdk.INPUT.actionMenuAccept = function()
{
	return GameEngine.keyboard.keyPressed(bmacSdk.KEYBOARD.SPACE) || GameEngine.keyboard.keyPressed(bmacSdk.KEYBOARD.ENTER)
		|| this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_A)
		|| GameEngine.mouse.mouseUpNew[1];
}

bmacSdk.INPUT.actionMenuCancel = function()
{
	return GameEngine.keyboard.keyPressed(bmacSdk.KEYBOARD.ESCAPE) || this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_B);
}

bmacSdk.INPUT.actionGamePause = function()
{
	return GameEngine.keyboard.keyPressed(bmacSdk.KEYBOARD.ESCAPE) || this.gamepadButtonPressed(this.FIRST_PLAYER, this.GB_START);
}

bmacSdk.INPUT.getGamepad = function(gamepad)
{
	if (this.gamepads && this.gamepads[gamepad])
		return this.gamepads[gamepad];
	else
		return null;
};

bmacSdk.INPUT.gamepadExists = function(gamepad)
{
	if (this.gamepads && this.gamepads[gamepad])
		return true;
	else
		return false;
};

bmacSdk.INPUT.gamepadConnected = function(gamepad)
{
	if (this.gamepads && this.gamepads[gamepad] && this.gamepads[gamepad].connected)
		return true;
	else
		return false;
};

bmacSdk.INPUT.gamepadButtonPressed = function(gamepad, button)
{
	return this.gamepadButtonDown(gamepad, button) && !this.gamepadButtonDownOld(gamepad, button);
};

bmacSdk.INPUT.gamepadButtonReleased = function(gamepad, button)
{
	return this.gamepadButtonUp(gamepad, button) && !this.gamepadButtonUpOld(gamepad, button);
};

bmacSdk.INPUT.gamepadButtonUp = function(gamepad, button)
{
	if (this.gamepads && this.gamepads[gamepad] && this.gamepads[gamepad].buttons.length > button)
		return !this.gamepads[gamepad].buttons[button].pressed;
	else
		return false;
};

bmacSdk.INPUT.gamepadButtonDown = function(gamepad, button)
{
	if (this.gamepads && this.gamepads[gamepad] && this.gamepads[gamepad].buttons.length > button)
		return this.gamepads[gamepad].buttons[button].pressed;
	else
		return false;
};

bmacSdk.INPUT.gamepadButtonUpOld = function(gamepad, button)
{
	if (this.oldGamepads && this.oldGamepads[gamepad] && this.oldGamepads[gamepad].buttons.length > button)
		return !this.oldGamepads[gamepad].buttons[button].pressed;
	else
		return false;
};

bmacSdk.INPUT.gamepadButtonDownOld = function(gamepad, button)
{
	if (this.oldGamepads && this.oldGamepads[gamepad] && this.oldGamepads[gamepad].buttons.length > button)
		return this.oldGamepads[gamepad].buttons[button].pressed;
	else
		return false;
};

bmacSdk.INPUT.gamepadButtonValue = function(gamepad, button)
{
	if (this.gamepads && this.gamepads[gamepad] && this.gamepads[gamepad].buttons.length > button)
		return this.gamepads[gamepad].buttons[button].value;
	else
		return 0;
};

bmacSdk.INPUT.gamepadAxis = function(gamepad, axis)
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

bmacSdk.INPUT.gamepadOldAxis = function(gamepad, axis)
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

bmacSdk.INPUT.gamepadAxisPressed = function(gamepad, axis)
{
	if (this.gamepadOldAxis(gamepad, axis) < this.STICK_THRESHOLD && this.gamepadAxis(gamepad, axis) >= this.STICK_THRESHOLD)
		return 1;
	else if (this.gamepadOldAxis(gamepad, axis) > -this.STICK_THRESHOLD && this.gamepadAxis(gamepad, axis) <= -this.STICK_THRESHOLD)
		return -1;
	else
		return 0;
};

bmacSdk.INPUT.cloneGamepadState = function(source)
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

bmacSdk.INPUT.update = function()
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
	
	bmacSdk.MOUSE.update();
	bmacSdk.KEYBOARD.update();
}




bmacSdk.MOUSE =
{
	mousePos: { x: 0, y: 0 },
	
	//stores current button state
	mouseDown: {},
	
	//buffers button changes for one frame
	//duplicated in order to remember the states into the next frame
	mousePressed: {},
	mouseReleased: {},
	mousePressedBuffer: {},
	mouseReleasedBuffer: {},
	
	LEFT	: 1,
	MIDDLE	: 2,
	RIGHT	: 3,
	OTHER	: 4,
}

bmacSdk.MOUSE.init = function()
{
	//create callbacks
	var self = this;
	this._onMouseMove = function(e)
	{
		e = e || window.event;
		self.mousePos.x = e.pageX;
		self.mousePos.y = e.pageY;
	};
	this._onDragOver = function(e)
	{
		e = e || window.event;
		self.mousePos.x = e.pageX,
		self.mousePos.y = e.pageY;
	}
	this._onMouseDown = function(e)
	{
		e = e || window.event;
		self.mousePressedBuffer[e.which || e.keyCode] = true;
	}
	this._onMouseUp = function(e)
	{
		e = e || window.event;
		self.mouseReleasedBuffer[e.which || e.keyCode] = true;
	}
	
	document.addEventListener("mousemove", this._onMouseMove, false);
	document.addEventListener("dragover", this._onDragOver, false);
	document.addEventListener("mousedown", this._onMouseDown, false);
	document.addEventListener("mouseup", this._onMouseUp, false);
}

bmacSdk.MOUSE.destroy = function()
{
	document.removeEventListener("mousemove", this._onMouseMove, false);
	document.removeEventListener("dragover", this._onDragOver, false);
	document.removeEventListener("mousedown", this._onMouseDown, false);
	document.removeEventListener("mouseup", this._onMouseUp, false);
}

bmacSdk.MOUSE.update = function()
{
	//cycle buffers
	var temp = this.mousePressed;
	this.mousePressed = this.mousePressedBuffer;
	this.mousePressedBuffer = temp;
	var temp = this.mouseReleased;
	this.mouseReleased = this.mouseReleasedBuffer;
	this.mouseReleasedBuffer = temp;
	
	//clear new buffer
	for (var i in this.mousePressedBuffer)
	{
		this.mousePressedBuffer[i] = false;
	}
	for (var i in this.mouseReleasedBuffer)
	{
		this.mouseReleasedBuffer[i] = false;
	}
	
	//update button down states
	for (var i in this.mousePressed)
	{
		if (this.mousePressed[i] && !this.mouseReleased[i])
			this.mouseDown[i] = true;
	}
	for (var i in this.mouseReleased)
	{
		if (this.mouseReleased[i] && !this.mousePressed[i])
			this.mouseDown[i] = false;
	}
}

bmacSdk.MOUSE.getPosition = function(relativeTo)
{
	if (!relativeTo) return { x:this.mousePos.x,y:this.mousePos.y };
	
	//Find global position of element
	var elemX = relativeTo.offsetLeft;
	var elemY = relativeTo.offsetTop;
	while (relativeTo = relativeTo.offsetParent)
	{
		elemX += relativeTo.offsetLeft;
		elemY += relativeTo.offsetTop;
	}
	
	//Calculate relative position of mouse
	var vec = {};
	vec.x = this.mousePos.x - elemX;
	vec.y = this.mousePos.y - elemY;
	return vec;
};

bmacSdk.MOUSE.buttonPressed = function(button)
{
	return !!this.mousePressed[button];
}

bmacSdk.MOUSE.buttonReleased = function(button)
{
	return !!this.mouseReleased[button];
}

bmacSdk.MOUSE.buttonDown = function(button)
{
	return !!this.mouseDown[button];
}

bmacSdk.MOUSE.buttonUp = function(button)
{
	return !this.mouseDown[button];
}





bmacSdk.KEYBOARD =
{
	//stores current button state
	keysDown: {},
	
	//buffers button changes for one frame
	keysPressed: {},
	keysReleased: {},
	keysPressedBuffer: {},
	keysReleasedBuffer: {},
	
	LEFT	: 37,
	UP	: 38,
	RIGHT	: 39,
	DOWN	: 40,
	SPACE	: 32,
	PGUP	: 33,
	PGDOWN	: 34,
	TAB	:  9,
	ESCAPE	: 27,
	ENTER	: 13,
	SHIFT	: 16,
	CTRL	: 17,
	ALT	: 18,
}

bmacSdk.KEYBOARD.init = function()
{
	//create callbacks
	var self = this;
	this._onKeyDown = function(e)
	{
		e = e || window.event;
		self.keysPressedBuffer[e.keyCode] = true;
		
		// prevent scrolling
		if (e.keyCode == bmacSdk.KEYBOARD.SPACE)
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
	
	document.addEventListener("keydown", this._onKeyDown, false);
	document.addEventListener("keyup", this._onKeyUp, false);
}

bmacSdk.KEYBOARD.destroy = function()
{
	document.removeEventListener("keydown", this._onKeyDown, false);
	document.removeEventListener("keyup", this._onKeyUp, false);
}

bmacSdk.KEYBOARD.update = function()
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
}

bmacSdk.KEYBOARD._translateKey = function(code)
{
	if (typeof code == 'string' || code instanceof String)
		return code.toUpperCase().charCodeAt(0);
	else
		return code;
}

bmacSdk.KEYBOARD.keyPressed = function(code)
{
	return !!this.keysPressed[this._translateKey(code)];
}

bmacSdk.KEYBOARD.keyReleased = function(code)
{
	return !!this.keysReleased[this._translateKey(code)];
}

bmacSdk.KEYBOARD.keyDown = function(code)
{
	return !!this.keysDown[this._translateKey(code)];
}

bmacSdk.KEYBOARD.keyUp = function(code)
{
	return !this.keysDown[this._translateKey(code)];
}
