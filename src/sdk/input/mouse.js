
module.exports = Mouse =
{
	/**
	 * Read-only. Set if 'document' was not found.
	 * @type {Boolean}
	 */
	isHeadless: false,

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

	/**
	 * Called by the SDK to start listening to the mouse.
	 */
	_init: function()
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
		
		if (typeof document !== "undefined")
		{
			document.addEventListener("mousemove", this._onMouseMove, false);
			document.addEventListener("dragover", this._onDragOver, false);
			document.addEventListener("mousedown", this._onMouseDown, false);
			document.addEventListener("mouseup", this._onMouseUp, false);
		}
		else
		{
			this.isHeadless = true;
		}
	},

	/**
	 * Called by the SDK to stop mouse listening.
	 */
	_destroy: function()
	{
		if (typeof document !== "undefined")
		{
			document.removeEventListener("mousemove", this._onMouseMove, false);
			document.removeEventListener("dragover", this._onDragOver, false);
			document.removeEventListener("mousedown", this._onMouseDown, false);
			document.removeEventListener("mouseup", this._onMouseUp, false);
		}
	},

	/**
	 * Called by the SDK each frame to update the input state.
	 */
	_update: function()
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
	},

	/**
	 * Returns the current position of the mouse relative to the specified HTML element.
	 * @param {Element} relativeTo
	 * @returns {Object}
	 */
	getPosition: function(relativeTo)
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
	},

	/**
	 * Returns true on the first frame the specified mouse button is pressed.
	 * @param {Number} button See constant definitions.
	 * @returns {Boolean}
	 */
	buttonPressed: function(button)
	{
		return !!this.mousePressed[button];
	},

	/**
	 * Returns true on the first frame the specified mouse button is released.
	 * @param {Number} button See constant definitions.
	 * @returns {Boolean}
	 */
	buttonReleased: function(button)
	{
		return !!this.mouseReleased[button];
	},

	/**
	 * Returns true if the specified mouse button is down.
	 * @param {Number} button See constant definitions.
	 * @returns {Boolean}
	 */
	buttonDown: function(button)
	{
		return !!this.mouseDown[button];
	},

	/**
	 * Returns true if the specified mouse button is not down.
	 * @param {Number} button See constant definitions.
	 * @returns {Boolean}
	 */
	buttonUp: function(button)
	{
		return !this.mouseDown[button];
	},
};
