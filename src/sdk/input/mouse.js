"use strict";
var THREE = require("three");
var Mouse;
(function (Mouse) {
    /**
     * Read-only. Set if 'document' was not found.
     * @type {boolean}
     */
    Mouse.isHeadless = false;
    Mouse.mousePos = { x: 0, y: 0 };
    //stores current button state
    var mouseDown = {};
    //buffers button changes for one frame
    //duplicated in order to remember the states into the next frame
    var mousePressed = {};
    var mouseReleased = {};
    var mousePressedBuffer = {};
    var mouseReleasedBuffer = {};
    (function (Button) {
        Button[Button["Left"] = 1] = "Left";
        Button[Button["Middle"] = 2] = "Middle";
        Button[Button["Right"] = 3] = "Right";
        Button[Button["Other"] = 4] = "Other";
    })(Mouse.Button || (Mouse.Button = {}));
    var Button = Mouse.Button;
    /**
     * Called by the SDK to start listening to the mouse.
     */
    function _init() {
        if (typeof document !== "undefined") {
            document.addEventListener("mousemove", _onMouseMove, false);
            document.addEventListener("dragover", _onDragOver, false);
            document.addEventListener("mousedown", _onMouseDown, false);
            document.addEventListener("mouseup", _onMouseUp, false);
        }
        else {
            Mouse.isHeadless = true;
        }
    }
    Mouse._init = _init;
    ;
    /**
     * Called by the SDK to stop mouse listening.
     */
    function _destroy() {
        if (typeof document !== "undefined") {
            document.removeEventListener("mousemove", _onMouseMove, false);
            document.removeEventListener("dragover", _onDragOver, false);
            document.removeEventListener("mousedown", _onMouseDown, false);
            document.removeEventListener("mouseup", _onMouseUp, false);
        }
    }
    Mouse._destroy = _destroy;
    ;
    /**
     * Called by the SDK each frame to update the input state.
     */
    function _update() {
        //cycle buffers
        var temp = mousePressed;
        mousePressed = mousePressedBuffer;
        mousePressedBuffer = temp;
        var temp = mouseReleased;
        mouseReleased = mouseReleasedBuffer;
        mouseReleasedBuffer = temp;
        //clear new buffer
        for (var i in mousePressedBuffer) {
            mousePressedBuffer[i] = false;
        }
        for (var i in mouseReleasedBuffer) {
            mouseReleasedBuffer[i] = false;
        }
        //update button down states
        for (var i in mousePressed) {
            if (mousePressed[i] && !mouseReleased[i])
                mouseDown[i] = true;
        }
        for (var i in mouseReleased) {
            if (mouseReleased[i] && !mousePressed[i])
                mouseDown[i] = false;
        }
    }
    Mouse._update = _update;
    ;
    function _onMouseMove(e) {
        e = e || window.event;
        Mouse.mousePos.x = e.pageX;
        Mouse.mousePos.y = e.pageY;
    }
    ;
    function _onDragOver(e) {
        e = e || window.event;
        Mouse.mousePos.x = e.pageX,
            Mouse.mousePos.y = e.pageY;
    }
    function _onMouseDown(e) {
        e = e || window.event;
        mousePressedBuffer[e.which || e.keyCode] = true;
    }
    function _onMouseUp(e) {
        e = e || window.event;
        mouseReleasedBuffer[e.which || e.keyCode] = true;
    }
    /**
     * Returns the current position of the mouse relative to the specified HTML element.
     * @param {Element} relativeTo
     * @returns {Object}
     */
    function getPosition(relativeTo) {
        if (!relativeTo)
            return new THREE.Vector2(Mouse.mousePos.x, Mouse.mousePos.y);
        //Find global position of element
        var elemX = relativeTo.offsetLeft;
        var elemY = relativeTo.offsetTop;
        while ((relativeTo.offsetParent instanceof HTMLElement)
            && (relativeTo = relativeTo.offsetParent)) {
            elemX += relativeTo.offsetLeft;
            elemY += relativeTo.offsetTop;
        }
        //Calculate relative position of mouse
        return new THREE.Vector2(Mouse.mousePos.x - elemX, Mouse.mousePos.y - elemY);
    }
    Mouse.getPosition = getPosition;
    ;
    /**
     * Returns true on the first frame the specified mouse button is pressed.
     * @param {number} button See constant definitions.
     * @returns {boolean}
     */
    function buttonPressed(button) {
        return !!mousePressed[button];
    }
    Mouse.buttonPressed = buttonPressed;
    ;
    /**
     * Returns true on the first frame the specified mouse button is released.
     * @param {number} button See constant definitions.
     * @returns {boolean}
     */
    function buttonReleased(button) {
        return !!mouseReleased[button];
    }
    Mouse.buttonReleased = buttonReleased;
    ;
    /**
     * Returns true if the specified mouse button is down.
     * @param {number} button See constant definitions.
     * @returns {boolean}
     */
    function buttonDown(button) {
        return !!mouseDown[button];
    }
    Mouse.buttonDown = buttonDown;
    ;
    /**
     * Returns true if the specified mouse button is not down.
     * @param {number} button See constant definitions.
     * @returns {boolean}
     */
    function buttonUp(button) {
        return !mouseDown[button];
    }
    Mouse.buttonUp = buttonUp;
    ;
})(Mouse = exports.Mouse || (exports.Mouse = {}));
;
