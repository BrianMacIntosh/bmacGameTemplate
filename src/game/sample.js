"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var engine_1 = require("../bmacSdk/engine");
var threeutils_1 = require("../bmacSdk/threeutils");
var input_1 = require("../bmacSdk/input");
var SampleGame = (function (_super) {
    __extends(SampleGame, _super);
    function SampleGame() {
        _super.apply(this, arguments);
        this.c_planeCorrection = new threeutils_1.THREE.Matrix4().makeRotationFromEuler(new threeutils_1.THREE.Euler(Math.PI, 0, 0));
    }
    // 'added' is called by the engine when this object is added
    SampleGame.prototype.added = function () {
        /*this.mesh = ThreeUtils.makeAtlasMesh(ThreeUtils.loadAtlas("general"), "a", true);
        this.mesh.position.set(200, 200, -10);
        this.owner.scene.add(this.mesh);

        this.mesh2 = ThreeUtils.makeAtlasMesh(ThreeUtils.loadAtlas("general"), "b", true);
        this.mesh2.position.set(200, 0, -10);
        this.owner.scene.add(this.mesh2);*/
        var loader = new threeutils_1.THREE.TextureLoader();
        var geometry3 = new threeutils_1.THREE.PlaneGeometry(64, 128);
        geometry3.applyMatrix(this.c_planeCorrection);
        this.mesh3 = new threeutils_1.THREE.Mesh(geometry3, new threeutils_1.THREE.MeshBasicMaterial({ map: loader.load("atlas-raw/general/a.png") }));
        this.mesh3.position.set(0, 0, -10);
        this.owner.scene.add(this.mesh3);
        var geometry4 = new threeutils_1.THREE.PlaneGeometry(256, 128);
        geometry4.applyMatrix(this.c_planeCorrection);
        this.mesh4 = new threeutils_1.THREE.Mesh(geometry4, new threeutils_1.THREE.MeshBasicMaterial({ map: loader.load("atlas-raw/general/b.png") }));
        this.mesh4.position.set(0, 200, -10);
        this.owner.scene.add(this.mesh4);
    };
    ;
    // 'removed' is called by the engine when this object is removed
    SampleGame.prototype.removed = function () {
    };
    ;
    // 'update' is called by the engine once per frame
    SampleGame.prototype.update = function (deltaSec) {
        // move the mesh 50 pixels per second based on input
        if (input_1.Keyboard.keyDown('a') || input_1.Keyboard.keyDown(input_1.Keyboard.Key.Left)) {
            this.mesh4.position.x -= 50 * deltaSec;
        }
        if (input_1.Keyboard.keyDown('d') || input_1.Keyboard.keyDown(input_1.Keyboard.Key.Right)) {
            this.mesh4.position.x += 50 * deltaSec;
        }
        _super.prototype.update.call(this, deltaSec);
    };
    ;
    return SampleGame;
}(engine_1.EngineObject));
exports.SampleGame = SampleGame;
