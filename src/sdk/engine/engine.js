
bmacSdk = require("./index.js");

//TODO: engine should set up Box2D world and listeners for you

/**
 * An Engine has a scene and a camera and manages game objects that are added to it.
 * @param {String} canvasDivName The name of the HTML element the canvas should be added to.
 */
var Engine = function(canvasDivName)
{
	bmacSdk.engines.push(this);
	this.objects = [];
	this.canvasDivName = canvasDivName;

	this.scene = new THREE.Scene();
	
	this.mainCamera = new THREE.OrthographicCamera(0, 0, 0, 0, 1, 100);
	this.mainCamera.position.set(0,0,0);
};

/**
 * Adds an object to the engine.
 * If the object has an 'added' method, it will be called now or when the DOM is attached.
 * If the object has an 'update' method, it will be called every frame until the object is removed.
 * @param {Object} object
 */
Engine.prototype.addObject = function(object)
{
	if (this.objects.contains(object))
		return object;
	if (object.added && bmacSdk.domAttached)
		object.added();
	this.objects.push(object);
	return object;
};

/**
 * Removes an object from the engine.
 * If the object has a 'removed' method, it will be called.
 * @param {Object} object
 */
Engine.prototype.removeObject = function(object)
{
	if (object.removed)
		object.removed();
	this.objects.remove(object);
};

/**
 * Initializes the engine.
 */
Engine.prototype._attachDom = function()
{
	if (!bmacSdk.isHeadless)
	{
		this.canvasDiv = document.getElementById(this.canvasDivName);
		this.renderer = new THREE.WebGLRenderer();
		this.canvasDiv.appendChild(this.renderer.domElement);
		this.canvasDiv.oncontextmenu = function() { return false; };
		this.renderer.setClearColor(0x000000, 1);
	}
	
	//TODO: 2D depth management
	
	this._handleWindowResize();
	
	for (var c = 0; c < this.objects.length; c++)
	{
		if (this.objects[c].added)
			this.objects[c].added();
	}
};

/**
 * Resizes the renderer to match the size of the window.
 */
Engine.prototype._handleWindowResize = function()
{
	if (this.canvasDiv) // for node server support
	{
		this.screenWidth = this.canvasDiv.offsetWidth;
		this.screenHeight = this.canvasDiv.offsetHeight;
		this.renderer.setSize(this.screenWidth, this.screenHeight);
	}
	this.mainCamera.left = -this.screenWidth/2;
	this.mainCamera.right = this.screenWidth/2;
	this.mainCamera.top = -this.screenHeight/2;
	this.mainCamera.bottom = this.screenHeight/2;
	this.mainCamera.updateProjectionMatrix();
}

Engine.prototype._animate = function()
{
	// calculate mouse pos
	var mousePos = Input.Mouse.getPosition(this.canvasDiv);
	if (!this.mousePosWorld) this.mousePosWorld = new THREE.Vector2();
	this.mousePosWorld.x = mousePos.x + this.mainCamera.position.x;
	this.mousePosWorld.y = mousePos.y + this.mainCamera.position.y;
	
	// update objects
	for (var c = 0; c < this.objects.length; c++)
	{
		if (this.objects[c].update)
			this.objects[c].update(bmacSdk.deltaSec);
	}
	
	// render
	if (this.renderer)
	{
		this.renderer.render(this.scene, this.mainCamera);
	}
};

module.exports = Engine;
