"use strict";
// load the SDK
var engine_1 = require("./src/bmacSdk/engine");
engine_1.bmacSdk.initialize();
// create a game engine
var GameEngine = engine_1.bmacSdk.createEngine("canvasDiv");
// add the sample game object to the engine
var sample_1 = require("./src/game/sample");
GameEngine.addObject(new sample_1.SampleGame());
// that's it!
