"use strict";
var Keyboard;
(function (Keyboard) {
    /**
     * Read-only. Set if 'document' was not found.
     * @type {boolean}
     */
    Keyboard.isHeadless = false;
    //stores current button state
    var keysDown = {};
    //buffers button changes for one frame
    var keysPressed = {};
    var keysReleased = {};
    var keysPressedBuffer = {};
    var keysReleasedBuffer = {};
    (function (Key) {
        Key[Key["Left"] = 37] = "Left";
        Key[Key["Up"] = 38] = "Up";
        Key[Key["Right"] = 39] = "Right";
        Key[Key["Down"] = 40] = "Down";
        Key[Key["Space"] = 32] = "Space";
        Key[Key["PageUp"] = 33] = "PageUp";
        Key[Key["PageDown"] = 34] = "PageDown";
        Key[Key["Tab"] = 9] = "Tab";
        Key[Key["Escape"] = 27] = "Escape";
        Key[Key["Enter"] = 13] = "Enter";
        Key[Key["Shift"] = 16] = "Shift";
        Key[Key["Ctrl"] = 17] = "Ctrl";
        Key[Key["Alt"] = 18] = "Alt";
    })(Keyboard.Key || (Keyboard.Key = {}));
    var Key = Keyboard.Key;
    /**
     * Called by the SDK to initialize keyboard listening.
     */
    function _init() {
        if (typeof document !== "undefined") {
            document.addEventListener("keydown", _onKeyDown, false);
            document.addEventListener("keyup", _onKeyUp, false);
        }
        else {
            Keyboard.isHeadless = true;
        }
    }
    Keyboard._init = _init;
    ;
    /**
     * Called by the SDK to stop keyboard listening.
     */
    function _destroy() {
        if (typeof document !== "undefined") {
            document.removeEventListener("keydown", _onKeyDown, false);
            document.removeEventListener("keyup", _onKeyUp, false);
        }
    }
    Keyboard._destroy = _destroy;
    ;
    /**
     * Called each frame by the SDK.
     */
    function _update() {
        //cycle buffers
        var temp = keysPressed;
        keysPressed = keysPressedBuffer;
        keysPressedBuffer = temp;
        var temp = keysReleased;
        keysReleased = keysReleasedBuffer;
        keysReleasedBuffer = temp;
        //clear new buffer
        for (var i in keysPressedBuffer) {
            keysPressedBuffer[i] = false;
        }
        for (var i in keysReleasedBuffer) {
            keysReleasedBuffer[i] = false;
        }
        //update button down states
        for (var i in keysPressed) {
            //ignore repeats
            if (keysDown[i])
                keysPressed[i] = false;
            else if (keysPressed[i] && !keysReleased[i])
                keysDown[i] = true;
        }
        for (var i in keysReleased) {
            //ignore repeats
            if (!keysDown[i])
                keysReleased[i] = false;
            else if (keysReleased[i] && !keysPressed[i])
                keysDown[i] = false;
        }
    }
    Keyboard._update = _update;
    ;
    function _onKeyDown(e) {
        e = e || window.event;
        keysPressedBuffer[e.keyCode] = true;
        // prevent scrolling
        if (e.keyCode == Key.Space) {
            e.preventDefault();
            return false;
        }
        else {
            return true;
        }
    }
    ;
    function _onKeyUp(e) {
        e = e || window.event;
        keysReleasedBuffer[e.keyCode] = true;
    }
    ;
    function _translateKey(code) {
        if (typeof code == 'string') {
            return code.toUpperCase().charCodeAt(0);
        }
        else {
            return code;
        }
    }
    ;
    /**
     * Returns true on the first frame the specified key is pressed.
     * @param {string|Key} code A character or a key scancode (see constant definitions).
     * @returns {boolean}
     */
    function keyPressed(code) {
        return !!keysPressed[_translateKey(code)];
    }
    Keyboard.keyPressed = keyPressed;
    ;
    /**
     * Returns true on the first frame the specified key is released.
     * @param {string|Key} code A character or a key scancode (see constant definitions).
     * @returns {boolean}
     */
    function keyReleased(code) {
        return !!keysReleased[_translateKey(code)];
    }
    Keyboard.keyReleased = keyReleased;
    ;
    /**
     * Returns true if the specified key is down.
     * @param {string|Key} code A character or a key scancode (see constant definitions).
     * @returns {boolean}
     */
    function keyDown(code) {
        return !!keysDown[_translateKey(code)];
    }
    Keyboard.keyDown = keyDown;
    ;
    /**
     * Returns true if the specified key is not down.
     * @param {string|Key} code A character or a key scancode (see constant definitions).
     * @returns {boolean}
     */
    function keyUp(code) {
        return !keysDown[_translateKey(code)];
    }
    Keyboard.keyUp = keyUp;
    ;
    /**
     * Returns the number key pressed this frame, or -1 if none.
     * @returns {number}
     */
    function getNumberPressed() {
        for (var i = 48; i <= 57; i++) {
            if (keyPressed(i))
                return i - 48;
        }
        return -1;
    }
    Keyboard.getNumberPressed = getNumberPressed;
    ;
})(Keyboard = exports.Keyboard || (exports.Keyboard = {}));
;
