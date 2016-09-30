
import { Keyboard } from "./keyboard";
import { Mouse } from "./mouse";
import { Gamepad } from "./gamepad";

export { Keyboard } from "./keyboard";
export { Mouse } from "./mouse";
export { Gamepad } from "./gamepad";

export namespace Input
{
	export var FIRST_PLAYER = 0; //TODO: dynamic

	/**
	 * Called by the SDK to initialize the input system.
	 */
	export function _init()
	{
		Keyboard._init();
		Mouse._init();
		Gamepad._init();
	};

	/**
	 * Called by the SDK to destroy the input system.
	 */
	export function _destroy()
	{
		Keyboard._destroy();
		Mouse._destroy();
		Gamepad._destroy();
	};

	/**
	 * Returns true if a 'left' control was pressed.
	 * @returns {boolean}
	 */
	export function actionMenuLeft(): boolean
	{
		return Keyboard.keyPressed(Keyboard.Key.Left) || Keyboard.keyPressed("a")
			|| Gamepad.axisPressed(FIRST_PLAYER, Gamepad.Axis.LeftStickX) < 0
			|| Gamepad.buttonPressed(FIRST_PLAYER, Gamepad.Button.DPadLeft);
	};

	/**
	 * Returns true if a 'right' control was pressed.
	 * @returns {boolean}
	 */
	export function actionMenuRight(): boolean
	{
		return Keyboard.keyPressed(Keyboard.Key.Right) || Keyboard.keyPressed("d")
			|| Gamepad.axisPressed(FIRST_PLAYER, Gamepad.Axis.LeftStickX) > 0
			|| Gamepad.buttonPressed(FIRST_PLAYER, Gamepad.Button.DPadRight);
	};

	/**
	 * Returns true if an 'up' control was pressed.
	 * @returns {boolean}
	 */
	export function actionMenuUp(): boolean
	{
		return Keyboard.keyPressed(Keyboard.Key.Up) || Keyboard.keyPressed("w")
			|| Gamepad.axisPressed(FIRST_PLAYER, Gamepad.Axis.LeftStickY) < 0
			|| Gamepad.buttonPressed(FIRST_PLAYER, Gamepad.Button.DPadUp);
	};

	/**
	 * Returns true if a 'down' control was pressed.
	 * @returns {boolean}
	 */
	export function actionMenuDown(): boolean
	{
		return Keyboard.keyPressed(Keyboard.Key.Down) || Keyboard.keyPressed("s")
			|| Gamepad.axisPressed(FIRST_PLAYER, Gamepad.Axis.LeftStickY) > 0
			|| Gamepad.buttonPressed(FIRST_PLAYER, Gamepad.Button.DPadDown);
	};

	/**
	 * Returns true if an 'accept' control was pressed.
	 * @returns {boolean}
	 */
	export function actionMenuAccept(): boolean
	{
		return Keyboard.keyPressed(Keyboard.Key.Space) || Keyboard.keyPressed(Keyboard.Key.Enter)
			|| Gamepad.buttonPressed(FIRST_PLAYER, Gamepad.Button.A);
	};

	/**
	 * Returns true if a 'cancel' control was pressed.
	 * @returns {boolean}
	 */
	export function actionMenuCancel(): boolean
	{
		return Keyboard.keyPressed(Keyboard.Key.Escape)
			|| Gamepad.buttonPressed(FIRST_PLAYER, Gamepad.Button.B);
	};

	/**
	 * Returns true if a 'pause' control was pressed.
	 * @returns {boolean}
	 */
	export function actionGamePause(): boolean
	{
		return Keyboard.keyPressed(Keyboard.Key.Escape)
			|| Gamepad.buttonPressed(FIRST_PLAYER, Gamepad.Button.Start);
	};

	/**
	 * Called by the SDK each frame.
	 */
	export function _update(): void
	{
		Keyboard._update();
		Mouse._update();
		Gamepad._update();
	};
};
