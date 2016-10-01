"use strict";
var Gamepad;
(function (Gamepad) {
    /**
     * Read-only. Set if gamepad data was not found.
     * @type {boolean}
     */
    Gamepad.isHeadless = false;
    var STICK_THRESHOLD = 0.5;
    var DEAD_ZONE = 0.3;
    (function (Button) {
        Button[Button["A"] = 0] = "A";
        Button[Button["B"] = 1] = "B";
        Button[Button["X"] = 2] = "X";
        Button[Button["Y"] = 3] = "Y";
        Button[Button["LeftShoulder"] = 4] = "LeftShoulder";
        Button[Button["RightShoulder"] = 5] = "RightShoulder";
        Button[Button["LeftTrigger"] = 6] = "LeftTrigger";
        Button[Button["RightTrigger"] = 7] = "RightTrigger";
        Button[Button["Back"] = 8] = "Back";
        Button[Button["Start"] = 9] = "Start";
        Button[Button["LeftStick"] = 10] = "LeftStick";
        Button[Button["RightStic"] = 11] = "RightStic";
        Button[Button["DPadUp"] = 12] = "DPadUp";
        Button[Button["DPadDown"] = 13] = "DPadDown";
        Button[Button["DPadLeft"] = 14] = "DPadLeft";
        Button[Button["DPadRight"] = 15] = "DPadRight";
        Button[Button["Home"] = 16] = "Home";
    })(Gamepad.Button || (Gamepad.Button = {}));
    var Button = Gamepad.Button;
    (function (Axis) {
        Axis[Axis["LeftStickX"] = 0] = "LeftStickX";
        Axis[Axis["LeftStickY"] = 1] = "LeftStickY";
        Axis[Axis["RightStickX"] = 2] = "RightStickX";
        Axis[Axis["RightStickY"] = 3] = "RightStickY";
    })(Gamepad.Axis || (Gamepad.Axis = {}));
    var Axis = Gamepad.Axis;
    var gamepads;
    var oldGamepads;
    function _init() {
    }
    Gamepad._init = _init;
    ;
    function _update() {
        if (typeof navigator !== "undefined" && navigator.getGamepads) {
            //HACK: so much garbage
            oldGamepads = _cloneGamepadState(gamepads);
            gamepads = _cloneGamepadState(navigator.getGamepads());
        }
        else {
            oldGamepads = undefined;
            gamepads = undefined;
            Gamepad.isHeadless = true;
        }
    }
    Gamepad._update = _update;
    ;
    function _destroy() {
    }
    Gamepad._destroy = _destroy;
    ;
    /**
     * Gets raw information for the gamepad at the specified index.
     * @param {number} index Gamepad index.
     */
    function getGamepad(index) {
        if (gamepads && gamepads[index])
            return gamepads[index];
        else
            return null;
    }
    Gamepad.getGamepad = getGamepad;
    ;
    /**
     * Returns true if there is a gamepad at the specified index.
     * @param {number} index Gamepad index.
     * @returns {boolean}
     */
    function gamepadExists(index) {
        if (gamepads && gamepads[index])
            return true;
        else
            return false;
    }
    Gamepad.gamepadExists = gamepadExists;
    ;
    /**
     * Returns true if there is a connected gamepad at the specified index.
     * @param {number} index Gamepad index.
     * @returns {boolean}
     */
    function gamepadConnected(index) {
        if (gamepads && gamepads[index] && gamepads[index].connected)
            return true;
        else
            return false;
    }
    Gamepad.gamepadConnected = gamepadConnected;
    ;
    /**
     * Returns true on the frame the specified gamepad presses the specified button.
     * @param {number} index Gamepad index.
     * @param {number} button See constant definitions.
     */
    function buttonPressed(index, button) {
        return buttonDown(index, button) && !_buttonDownOld(index, button);
    }
    Gamepad.buttonPressed = buttonPressed;
    ;
    /**
     * Returns true on the frame the specified gamepad releases the specified button.
     * @param {number} index Gamepad index.
     * @param {number} button See constant definitions.
     */
    function buttonReleased(index, button) {
        return buttonUp(index, button) && !_buttonUpOld(index, button);
    }
    Gamepad.buttonReleased = buttonReleased;
    ;
    /**
     * Returns true if the specified button on the specified gamepad is not down.
     * @param {number} index Gamepad index.
     * @param {number} button See constant definitions.
     */
    function buttonUp(index, button) {
        if (gamepads && gamepads[index] && gamepads[index].buttons.length > button)
            return !gamepads[index].buttons[button].pressed;
        else
            return false;
    }
    Gamepad.buttonUp = buttonUp;
    ;
    /**
     * Returns true if the specified button on the specified gamepad is down.
     * @param {number} index Gamepad index.
     * @param {number} button See constant definitions.
     */
    function buttonDown(index, button) {
        if (gamepads && gamepads[index] && gamepads[index].buttons.length > button)
            return gamepads[index].buttons[button].pressed;
        else
            return false;
    }
    Gamepad.buttonDown = buttonDown;
    ;
    function _buttonUpOld(index, button) {
        if (oldGamepads && oldGamepads[index] && oldGamepads[index].buttons.length > button)
            return !oldGamepads[index].buttons[button].pressed;
        else
            return false;
    }
    ;
    function _buttonDownOld(index, button) {
        if (oldGamepads && oldGamepads[index] && oldGamepads[index].buttons.length > button)
            return oldGamepads[index].buttons[button].pressed;
        else
            return false;
    }
    ;
    /**
     * Returns the raw value of the specified gamepad button.
     * @param {number} index Gamepad index.
     * @param {number} button See constant definitions.
     */
    function buttonValue(index, button) {
        if (gamepads && gamepads[index] && gamepads[index].buttons.length > button)
            return gamepads[index].buttons[button].value;
        else
            return 0;
    }
    Gamepad.buttonValue = buttonValue;
    ;
    /**
     * Returns the value of the specified gamepad axis.
     * @param {number} index Gamepad index.
     * @param {number} axisIndex See constant definitions.
     */
    function getAxis(index, axisIndex) {
        if (gamepads && gamepads[index] && gamepads[index].axes.length > axisIndex) {
            var val = gamepads[index].axes[axisIndex];
            if (Math.abs(val) <= DEAD_ZONE)
                val = 0;
            return val;
        }
        else
            return 0;
    }
    Gamepad.getAxis = getAxis;
    ;
    function _getOldAxis(index, axisIndex) {
        if (oldGamepads && oldGamepads[index] && oldGamepads[index].axes.length > axisIndex) {
            var val = oldGamepads[index].axes[axisIndex];
            if (Math.abs(val) <= DEAD_ZONE)
                val = 0;
            return val;
        }
        else
            return 0;
    }
    ;
    /**
     * Returns 1 or -1 on the first frame the specified axis is pressed in that direction, or 0 if it isn't pressed.
     * @param {number} index Gamepad index.
     * @param {number} axisIndex See constant definitions.
     */
    function axisPressed(index, axisIndex) {
        if (_getOldAxis(index, axisIndex) < STICK_THRESHOLD && getAxis(index, axisIndex) >= STICK_THRESHOLD)
            return 1;
        else if (_getOldAxis(index, axisIndex) > -STICK_THRESHOLD && getAxis(index, axisIndex) <= -STICK_THRESHOLD)
            return -1;
        else
            return 0;
    }
    Gamepad.axisPressed = axisPressed;
    ;
    function _cloneGamepadState(source) {
        if (!source)
            return null;
        var target = [];
        target.length = source.length;
        for (var i = 0; i < source.length; i++) {
            if (source[i]) {
                var gamepad = source[i];
                var state = {};
                state.buttons = [];
                state.buttons.length = gamepad.buttons.length;
                state.axes = [];
                for (var a = 0; a < gamepad.axes.length; a++) {
                    state.axes[a] = gamepad.axes[a];
                }
                for (var b = 0; b < gamepad.buttons.length; b++) {
                    var obj = { pressed: gamepad.buttons[b].pressed, value: gamepad.buttons[b].value };
                    state.buttons[b] = obj;
                }
                target[i] = state;
            }
            else {
                target[i] = null;
            }
        }
        return target;
    }
    ;
})(Gamepad = exports.Gamepad || (exports.Gamepad = {}));
