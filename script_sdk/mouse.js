
bmacSdk.MOUSE =
{
	LEFT:	1,
	RIGHT:	2,
	MIDDLE:	3,
	OTHER:	4,
}

bmacSdk.MouseState = function()
{
	this.mousePos = { x: 0, y: 0 };
	
	//stores current button state
	this.mouseDown = {};
	
	//buffers button changes for one frame
	//duplicated in order to remember the states into the next frame
	this.mousePressed = {};
	this.mouseReleased = {};
	this.mousePressedBuffer = {};
	this.mouseReleasedBuffer = {};
	
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

bmacSdk.MouseState.prototype.destroy = function()
{
	document.removeEventListener("mousemove", this._onMouseMove, false);
	document.removeEventListener("dragover", this._onDragOver, false);
	document.removeEventListener("mousedown", this._onMouseDown, false);
	document.removeEventListener("mouseup", this._onMouseUp, false);
}

bmacSdk.MouseState.prototype.update = function()
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

bmacSdk.MouseState.prototype.getPosition = function(relativeTo)
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

bmacSdk.MouseState.prototype.buttonPressed = function(button)
{
	return !!this.mousePressed[button];
}

bmacSdk.MouseState.prototype.buttonReleased = function(button)
{
	return !!this.mouseReleased[button];
}

bmacSdk.MouseState.prototype.buttonDown = function(button)
{
	return !!this.mouseDown[button];
}

bmacSdk.MouseState.prototype.buttonUp = function(button)
{
	return !this.mouseDown[button];
}
