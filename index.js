
bmacSdk = require("./src/sdk/engine/index.js");
bmacSdk.initialize();

GameEngine = new bmacSdk.Engine("canvasDiv");

GameEngine.addObject(require("./src/game/sample.js"));
