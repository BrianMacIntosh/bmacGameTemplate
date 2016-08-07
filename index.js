
// load the SDK
bmacSdk = require("./src/sdk/engine");
bmacSdk.initialize();

// create a game engine
GameEngine = new bmacSdk.Engine("canvasDiv");

// add the sample game object to the engine
GameEngine.addObject(require("./src/game/sample.js"));

// that's it!
