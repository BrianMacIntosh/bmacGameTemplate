
module.exports = Keyboard =
{
	//stores current button state
	keysDown: {},
	
	//buffers button changes for one frame
	keysPressed: {},
	keysReleased: {},
	keysPressedBuffer: {},
	keysReleasedBuffer: {},
}

Keyboard.LEFT	= 37;
Keyboard.UP	= 38;
Keyboard.RIGHT	= 39;
Keyboard.DOWN	= 40;
Keyboard.SPACE	= 32;
Keyboard.PGUP	= 33;
Keyboard.PGDOWN	= 34;
Keyboard.TAB	=  9;
Keyboard.ESCAPE	= 27;
Keyboard.ENTER	= 13;
Keyboard.SHIFT	= 16;
Keyboard.CTRL	= 17;
Keyboard.ALT	= 18;

Keyboard.init = function()
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
	
	document.addEventListener("keydown", this._onKeyDown, false);
	document.addEventListener("keyup", this._onKeyUp, false);
}

Keyboard.destroy = function()
{
	document.removeEventListener("keydown", this._onKeyDown, false);
	document.removeEventListener("keyup", this._onKeyUp, false);
}

Keyboard.update = function()
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

Keyboard._translateKey = function(code)
{
	if (typeof code == 'string' || code instanceof String)
		return code.toUpperCase().charCodeAt(0);
	else
		return code;
}

Keyboard.keyPressed = function(code)
{
	return !!this.keysPressed[this._translateKey(code)];
}

Keyboard.keyReleased = function(code)
{
	return !!this.keysReleased[this._translateKey(code)];
}

Keyboard.keyDown = function(code)
{
	return !!this.keysDown[this._translateKey(code)];
}

Keyboard.keyUp = function(code)
{
	return !this.keysDown[this._translateKey(code)];
}
