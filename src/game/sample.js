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
    }
    // 'added' is called by the engine when this object is added
    SampleGame.prototype.added = function () {
        this.dirtTexture = threeutils_1.ThreeUtils.loadTexture("media/dirt.png");
        this.dirtGeo = threeutils_1.ThreeUtils.makeSpriteGeo(128, 64);
        this.mesh = threeutils_1.ThreeUtils.makeSpriteMesh(this.dirtTexture, this.dirtGeo);
        this.mesh.position.set(200, 200, -10);
        this.owner.scene.add(this.mesh);
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
            this.mesh.position.x -= 50 * deltaSec;
        }
        if (input_1.Keyboard.keyDown('d') || input_1.Keyboard.keyDown(input_1.Keyboard.Key.Right)) {
            this.mesh.position.x += 50 * deltaSec;
        }
        _super.prototype.update.call(this, deltaSec);
    };
    ;
    return SampleGame;
}(engine_1.EngineObject));
exports.SampleGame = SampleGame;
