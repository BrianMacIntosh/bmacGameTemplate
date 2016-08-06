
ThreeUtils = require("../sdk/threeutils");

module.exports = sampleGame =
{
	
};

sampleGame.added = function()
{
	this.dirtTexture = ThreeUtils.textureLoader.load("media/dirt.png");
	this.dirtGeo = ThreeUtils.makeSpriteGeo(128, 64);
	
	var m = ThreeUtils.makeSpriteMesh(this.dirtTexture, this.dirtGeo);
	m.position.set(200, 200, -10);
	GameEngine.scene.add(m);
};

sampleGame.removed = function()
{
	
};

sampleGame.update = function()
{
	
};
