
GameEngine = new bmacSdk.Engine("canvasDiv");

sampleGame =
{
	
};

sampleGame.added = function()
{
	this.dirtTexture = THREE.ImageUtils.loadTexture("media/dirt.png");
	this.dirtGeo = bmacSdk.GEO.makeSpriteGeo(128, 64);
	
	var m = bmacSdk.GEO.makeSpriteMesh(this.dirtTexture, this.dirtGeo);
	m.position.set(200, 200, -10);
	GameEngine.scene.add(m);
};

sampleGame.removed = function()
{
	
};

sampleGame.update = function()
{
	
};


GameEngine.addObject(sampleGame);