
module.exports = Input = 
{
	FIRST_PLAYER: 0, //TODO: dynamic

	Keyboard: require("./keyboard.js"),
	Mouse: require("./mouse.js"),
	Gamepad: require("./gamepad.js"),

	/**
	 * Called by the SDK to initialize the input system.
	 */
	_init: function()
	{
		this.Keyboard._init();
		this.Mouse._init();
		this.Gamepad._init();
	},

	/**
	 * Called by the SDK to destroy the input system.
	 */
	_destroy: function()
	{
		this.Keyboard._destroy();
		this.Mouse._destroy();
		this.Gamepad._destroy();
	},

	/**
	 * Returns true if a 'left' control was pressed.
	 * @returns {Boolean}
	 */
	actionMenuLeft: function()
	{
		return this.Keyboard.keyPressed(this.Keyboard.LEFT) || this.Keyboard.keyPressed("a")
			|| this.Gamepad.axisPressed(this.FIRST_PLAYER, this.Gamepad.GA_LEFTSTICK_X) < 0
			|| this.Gamepad.buttonPressed(this.FIRST_PLAYER, this.Gamepad.GB_DPAD_LEFT);
	},

	/**
	 * Returns true if a 'right' control was pressed.
	 * @returns {Boolean}
	 */
	actionMenuRight: function()
	{
		return this.Keyboard.keyPressed(this.Keyboard.RIGHT) || this.Keyboard.keyPressed("d")
			|| this.Gamepad.axisPressed(this.FIRST_PLAYER, this.Gamepad.GA_LEFTSTICK_X) > 0
			|| this.Gamepad.buttonPressed(this.FIRST_PLAYER, this.Gamepad.GB_DPAD_RIGHT);
	},

	/**
	 * Returns true if an 'up' control was pressed.
	 * @returns {Boolean}
	 */
	actionMenuUp: function()
	{
		return this.Keyboard.keyPressed(this.Keyboard.UP) || this.Keyboard.keyPressed("w")
			|| this.Gamepad.axisPressed(this.FIRST_PLAYER, this.Gamepad.GA_LEFTSTICK_Y) < 0
			|| this.Gamepad.buttonPressed(this.FIRST_PLAYER, this.Gamepad.GB_DPAD_UP);
	},

	/**
	 * Returns true if a 'down' control was pressed.
	 * @returns {Boolean}
	 */
	actionMenuDown: function()
	{
		return this.Keyboard.keyPressed(this.Keyboard.DOWN) || this.Keyboard.keyPressed("s")
			|| this.Gamepad.axisPressed(this.FIRST_PLAYER, this.Gamepad.GA_LEFTSTICK_Y) > 0
			|| this.Gamepad.buttonPressed(this.FIRST_PLAYER, this.Gamepad.GB_DPAD_DOWN);
	},

	/**
	 * Returns true if an 'accept' control was pressed.
	 * @returns {Boolean}
	 */
	actionMenuAccept: function()
	{
		return this.Keyboard.keyPressed(this.Keyboard.SPACE) || this.Keyboard.keyPressed(this.Keyboard.ENTER)
			|| this.Gamepad.buttonPressed(this.FIRST_PLAYER, this.Gamepad.GB_A);
	},

	/**
	 * Returns true if a 'cancel' control was pressed.
	 * @returns {Boolean}
	 */
	actionMenuCancel: function()
	{
		return this.Keyboard.keyPressed(this.Keyboard.ESCAPE)
			|| this.Gamepad.buttonPressed(this.FIRST_PLAYER, this.Gamepad.GB_B);
	},

	/**
	 * Returns true if a 'pause' control was pressed.
	 * @returns {Boolean}
	 */
	actionGamePause: function()
	{
		return this.Keyboard.keyPressed(this.Keyboard.ESCAPE)
			|| this.Gamepad.buttonPressed(this.FIRST_PLAYER, this.Gamepad.GB_START);
	},

	/**
	 * Called by the SDK each frame.
	 */
	_update: function()
	{
		this.Keyboard._update();
		this.Mouse._update();
		this.Gamepad._update();
	},
};
