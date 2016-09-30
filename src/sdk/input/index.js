"use strict";
var keyboard_1 = require("./keyboard");
var mouse_1 = require("./mouse");
var gamepad_1 = require("./gamepad");
var keyboard_2 = require("./keyboard");
exports.Keyboard = keyboard_2.Keyboard;
var mouse_2 = require("./mouse");
exports.Mouse = mouse_2.Mouse;
var gamepad_2 = require("./gamepad");
exports.Gamepad = gamepad_2.Gamepad;
var Input;
(function (Input) {
    Input.FIRST_PLAYER = 0; //TODO: dynamic
    /**
     * Called by the SDK to initialize the input system.
     */
    function _init() {
        keyboard_1.Keyboard._init();
        mouse_1.Mouse._init();
        gamepad_1.Gamepad._init();
    }
    Input._init = _init;
    ;
    /**
     * Called by the SDK to destroy the input system.
     */
    function _destroy() {
        keyboard_1.Keyboard._destroy();
        mouse_1.Mouse._destroy();
        gamepad_1.Gamepad._destroy();
    }
    Input._destroy = _destroy;
    ;
    /**
     * Returns true if a 'left' control was pressed.
     * @returns {boolean}
     */
    function actionMenuLeft() {
        return keyboard_1.Keyboard.keyPressed(keyboard_1.Keyboard.Key.Left) || keyboard_1.Keyboard.keyPressed("a")
            || gamepad_1.Gamepad.axisPressed(Input.FIRST_PLAYER, gamepad_1.Gamepad.Axis.LeftStickX) < 0
            || gamepad_1.Gamepad.buttonPressed(Input.FIRST_PLAYER, gamepad_1.Gamepad.Button.DPadLeft);
    }
    Input.actionMenuLeft = actionMenuLeft;
    ;
    /**
     * Returns true if a 'right' control was pressed.
     * @returns {boolean}
     */
    function actionMenuRight() {
        return keyboard_1.Keyboard.keyPressed(keyboard_1.Keyboard.Key.Right) || keyboard_1.Keyboard.keyPressed("d")
            || gamepad_1.Gamepad.axisPressed(Input.FIRST_PLAYER, gamepad_1.Gamepad.Axis.LeftStickX) > 0
            || gamepad_1.Gamepad.buttonPressed(Input.FIRST_PLAYER, gamepad_1.Gamepad.Button.DPadRight);
    }
    Input.actionMenuRight = actionMenuRight;
    ;
    /**
     * Returns true if an 'up' control was pressed.
     * @returns {boolean}
     */
    function actionMenuUp() {
        return keyboard_1.Keyboard.keyPressed(keyboard_1.Keyboard.Key.Up) || keyboard_1.Keyboard.keyPressed("w")
            || gamepad_1.Gamepad.axisPressed(Input.FIRST_PLAYER, gamepad_1.Gamepad.Axis.LeftStickY) < 0
            || gamepad_1.Gamepad.buttonPressed(Input.FIRST_PLAYER, gamepad_1.Gamepad.Button.DPadUp);
    }
    Input.actionMenuUp = actionMenuUp;
    ;
    /**
     * Returns true if a 'down' control was pressed.
     * @returns {boolean}
     */
    function actionMenuDown() {
        return keyboard_1.Keyboard.keyPressed(keyboard_1.Keyboard.Key.Down) || keyboard_1.Keyboard.keyPressed("s")
            || gamepad_1.Gamepad.axisPressed(Input.FIRST_PLAYER, gamepad_1.Gamepad.Axis.LeftStickY) > 0
            || gamepad_1.Gamepad.buttonPressed(Input.FIRST_PLAYER, gamepad_1.Gamepad.Button.DPadDown);
    }
    Input.actionMenuDown = actionMenuDown;
    ;
    /**
     * Returns true if an 'accept' control was pressed.
     * @returns {boolean}
     */
    function actionMenuAccept() {
        return keyboard_1.Keyboard.keyPressed(keyboard_1.Keyboard.Key.Space) || keyboard_1.Keyboard.keyPressed(keyboard_1.Keyboard.Key.Enter)
            || gamepad_1.Gamepad.buttonPressed(Input.FIRST_PLAYER, gamepad_1.Gamepad.Button.A);
    }
    Input.actionMenuAccept = actionMenuAccept;
    ;
    /**
     * Returns true if a 'cancel' control was pressed.
     * @returns {boolean}
     */
    function actionMenuCancel() {
        return keyboard_1.Keyboard.keyPressed(keyboard_1.Keyboard.Key.Escape)
            || gamepad_1.Gamepad.buttonPressed(Input.FIRST_PLAYER, gamepad_1.Gamepad.Button.B);
    }
    Input.actionMenuCancel = actionMenuCancel;
    ;
    /**
     * Returns true if a 'pause' control was pressed.
     * @returns {boolean}
     */
    function actionGamePause() {
        return keyboard_1.Keyboard.keyPressed(keyboard_1.Keyboard.Key.Escape)
            || gamepad_1.Gamepad.buttonPressed(Input.FIRST_PLAYER, gamepad_1.Gamepad.Button.Start);
    }
    Input.actionGamePause = actionGamePause;
    ;
    /**
     * Called by the SDK each frame.
     */
    function _update() {
        keyboard_1.Keyboard._update();
        mouse_1.Mouse._update();
        gamepad_1.Gamepad._update();
    }
    Input._update = _update;
    ;
})(Input = exports.Input || (exports.Input = {}));
;
