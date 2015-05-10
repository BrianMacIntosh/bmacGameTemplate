
bmacSdk.KEYBOARD =
{
	LEFT	: 37,
	UP	: 38,
	RIGHT	: 39,
	DOWN	: 40,
	SPACE	: 32,
	PGUP	: 33,
	PGDOWN	: 34,
	TAB	: 9,
	ESCAPE	: 27,
	ENTER	: 13,
}

bmacSdk.KeyboardState = function()
{
	//stores current button state
	this.keysDown = {};
	
	//buffers button changes for one frame
	this.keysPressed = {};
	this.keysReleased = {};
	this.keysPressedBuffer = {};
	this.keysReleasedBuffer = {};
	
	//create callbacks
	var self = this;
	this._onKeyDown = function(e)
	{
		e = e || window.event;
		self.keysPressedBuffer[e.keyCode] = true;
	};
	this._onKeyUp = function(e)
	{
		e = e || window.event;
		self.keysReleasedBuffer[e.keyCode] = true;
	};
	
	document.addEventListener("keydown", this._onKeyDown, false);
	document.addEventListener("keyup", this._onKeyUp, false);
}

bmacSdk.KeyboardState.prototype.destroy = function()
{
	document.removeEventListener("keydown", this._onKeyDown, false);
	document.removeEventListener("keyup", this._onKeyUp, false);
}

bmacSdk.KeyboardState.prototype.update = function()
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

bmacSdk.KeyboardState.prototype._translateKey = function(code)
{
	if (typeof code == 'string' || code instanceof String)
		return code.toUpperCase().charCodeAt(0);
	else
		return code;
}

bmacSdk.KeyboardState.prototype.keyPressed = function(code)
{
	return !!this.keysPressed[this._translateKey(code)];
}

bmacSdk.KeyboardState.prototype.keyReleased = function(code)
{
	return !!this.keysReleased[this._translateKey(code)];
}

bmacSdk.KeyboardState.prototype.keyDown = function(code)
{
	return !!this.keysDown[this._translateKey(code)];
}

bmacSdk.KeyboardState.prototype.keyUp = function(code)
{
	return !this.keysDown[this._translateKey(code)];
}
