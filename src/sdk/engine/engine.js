"use strict";
var THREE = require("three");
var _1 = require("./");
var input_1 = require("../input");
//TODO: engine should set up Box2D world and listeners for you
var EngineObject = (function () {
    function EngineObject() {
    }
    ;
    EngineObject.prototype.added = function () { };
    ;
    EngineObject.prototype.removed = function () { };
    ;
    EngineObject.prototype.update = function (deltaSec) { };
    ;
    return EngineObject;
}());
exports.EngineObject = EngineObject;
;
/**
 * An Engine has a scene and a camera and manages game objects that are added to it.
 * @param {string} canvasDivName The name of the HTML element the canvas should be added to.
 */
var Engine = (function () {
    function Engine(canvasDivName) {
        this.objects = [];
        this.scene = new THREE.Scene();
        this.canvasDivName = canvasDivName;
        this.mainCamera = new THREE.OrthographicCamera(0, 0, 0, 0, 1, 100);
        this.mainCamera.position.set(0, 0, 0);
    }
    ;
    /**
     * Adds an object to the engine.
     * If the object has an 'added' method, it will be called now or when the DOM is attached.
     * If the object has an 'update' method, it will be called every frame until the object is removed.
     * @param {Object} object
     */
    Engine.prototype.addObject = function (object) {
        object.owner = this;
        if (this.objects.contains(object))
            return object;
        if (object.added && _1.bmacSdk.domAttached)
            object.added();
        this.objects.push(object);
        return object;
    };
    ;
    /**
     * Removes an object from the engine.
     * If the object has a 'removed' method, it will be called.
     * @param {Object} object
     */
    Engine.prototype.removeObject = function (object) {
        if (object.removed)
            object.removed();
        this.objects.remove(object);
    };
    ;
    /**
     * Initializes the engine.
     */
    Engine.prototype._attachDom = function () {
        if (!_1.bmacSdk.isHeadless) {
            this.canvasDiv = document.getElementById(this.canvasDivName);
            this.renderer = new THREE.WebGLRenderer();
            this.canvasDiv.appendChild(this.renderer.domElement);
            this.canvasDiv.oncontextmenu = function () { return false; };
            this.renderer.setClearColor(0x000000, 1);
        }
        //TODO: 2D depth management
        this._handleWindowResize();
        for (var c = 0; c < this.objects.length; c++) {
            if (this.objects[c].added) {
                this.objects[c].added();
            }
        }
    };
    ;
    /**
     * Resizes the renderer to match the size of the window.
     */
    Engine.prototype._handleWindowResize = function () {
        if (this.canvasDiv) {
            this.screenWidth = this.canvasDiv.offsetWidth;
            this.screenHeight = this.canvasDiv.offsetHeight;
            this.renderer.setSize(this.screenWidth, this.screenHeight);
        }
        this.mainCamera.left = -this.screenWidth / 2;
        this.mainCamera.right = this.screenWidth / 2;
        this.mainCamera.top = -this.screenHeight / 2;
        this.mainCamera.bottom = this.screenHeight / 2;
        this.mainCamera.updateProjectionMatrix();
    };
    ;
    Engine.prototype._animate = function () {
        // calculate mouse pos
        var mousePos = input_1.Mouse.getPosition(this.canvasDiv);
        if (!this.mousePosWorld)
            this.mousePosWorld = new THREE.Vector2();
        this.mousePosWorld.set(mousePos.x + this.mainCamera.position.x, mousePos.y + this.mainCamera.position.y);
        // update objects
        for (var c = 0; c < this.objects.length; c++) {
            if (this.objects[c].update) {
                this.objects[c].update(_1.bmacSdk.getDeltaSec());
            }
        }
        // render
        if (this.renderer) {
            this.renderer.render(this.scene, this.mainCamera);
        }
    };
    ;
    return Engine;
}());
exports.Engine = Engine;
;
