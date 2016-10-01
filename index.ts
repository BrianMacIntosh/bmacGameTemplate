
// load the SDK
import { bmacSdk } from "./src/bmacSdk/engine";
bmacSdk.initialize();

// create a game engine
var GameEngine = bmacSdk.createEngine("canvasDiv");

// add the sample game object to the engine
import { SampleGame } from "./src/game/sample";
GameEngine.addObject(new SampleGame());

// that's it!
