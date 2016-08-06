
bmacSdk = require("./src/sdk/engine");
bmacSdk.initialize();

GameEngine = new bmacSdk.Engine("canvasDiv");

GameEngine.addObject(require("./src/game/sample.js"));
