
ThreeUtils = require("../sdk/threeutils");

module.exports = sampleGame =
{
	
};

sampleGame.added = function()
{
	this.dirtTexture = ThreeUtils.loadTexture("media/dirt.png");
	this.dirtGeo = ThreeUtils.makeSpriteGeo(128, 64);
	
	this.mesh = ThreeUtils.makeSpriteMesh(this.dirtTexture, this.dirtGeo);
	this.mesh.position.set(200, 200, -10);
	GameEngine.scene.add(this.mesh);
};

sampleGame.removed = function()
{
	
};

sampleGame.update = function()
{
	// move the mesh 5 pixels per second
	this.mesh.position.x -= 5 * bmacSdk.deltaSec;
};
