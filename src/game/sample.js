
ThreeUtils = require("../sdk/threeutils");
Input = require("../sdk/input");

module.exports = sampleGame =
{
	
};

// 'added' is called by the engine when this object is added
sampleGame.added = function()
{
	this.dirtTexture = ThreeUtils.loadTexture("media/dirt.png");
	this.dirtGeo = ThreeUtils.makeSpriteGeo(128, 64);
	
	this.mesh = ThreeUtils.makeSpriteMesh(this.dirtTexture, this.dirtGeo);
	this.mesh.position.set(200, 200, -10);
	GameEngine.scene.add(this.mesh);
};

// 'removed' is called by the engine when this object is removed
sampleGame.removed = function()
{
	
};

// 'update' is called by the engine once per frame
sampleGame.update = function()
{
	// move the mesh 50 pixels per second based on input
	if (Input.Keyboard.keyDown('a') || Input.Keyboard.keyDown(Input.Keyboard.LEFT))
	{
		this.mesh.position.x -= 50 * bmacSdk.deltaSec;
	}
	if (Input.Keyboard.keyDown('d') || Input.Keyboard.keyDown(Input.Keyboard.RIGHT))
	{
		this.mesh.position.x += 50 * bmacSdk.deltaSec;
	}
};
