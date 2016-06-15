
GameEngine = new bmacSdk.Engine("canvasDiv");

sampleGame =
{
	
};

sampleGame.added = function()
{
	var textureLoader = new THREE.TextureLoader();
	
	this.dirtTexture = textureLoader.load("media/dirt.png");
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


GameEngine.addObject(sampleGame);