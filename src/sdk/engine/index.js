
require("../utils");
Input = require("../input");
THREE = require("three");

module.exports = bmacSdk =
{
	CFG_PAUSE_WHEN_UNFOCUSED: false,
	
	//Used to ignore large frame delta after focusin
	_eatFrame: false,
	
	isFocused: true,
	domAttached: false,
	timeScale: 1,
	
	get deltaSec()
	{
		return this._deltaSec * this.timeScale;
	},
	_deltaSec: 0,
	
	engines: [],
};

bmacSdk.Engine = function(canvasDivName)
{
	bmacSdk.engines.push(this);
	this.objects = [];
	this.canvasDivName = canvasDivName;

	this.scene = new THREE.Scene();
	
	this.mainCamera = new THREE.OrthographicCamera(0, 0, 0, 0, 1, 100);
	this.mainCamera.position.set(0,0,0);
};

bmacSdk.initialize = function()
{
	window.onblur = document.onfocusout = function()
	{
		bmacSdk.isFocused = false;
	};
	window.onfocus = document.onfocusin = function()
	{
		bmacSdk.isFocused = true;
		bmacSdk._eatFrame = true;
	};
	window.addEventListener("resize", function()
	{
		if (bmacSdk.domAttached)
		{
			for (var c = 0; c < bmacSdk.engines.length; c++)
			{
				bmacSdk.engines[c]._handleWindowResize();
			}
		}
	});
}

bmacSdk._attachDom = function()
{
	this.domAttached = true;
	
	for (var c = 0; c < bmacSdk.engines.length; c++)
	{
		bmacSdk.engines[c]._attachDom();
	}
	
	Input.init();
	
	this._lastFrame = Date.now();
	this._animate();
};

/*
Object System:
Objects get these methods called if they have them:

void added();
- Called when the object is added to the scene
void removed();
- Called when the object is removed from the scene
void update();
- Called once per frame
*/

bmacSdk.Engine.prototype.addObject = function(object)
{
	if (this.objects.contains(object))
		return object;
	if (object.added && bmacSdk.domAttached)
		object.added();
	this.objects.push(object);
	return object;
};

bmacSdk.Engine.prototype.removeObject = function(object)
{
	if (object.removed)
		object.removed();
	this.objects.remove(object);
};

bmacSdk.Engine.prototype._attachDom = function()
{
	this.canvasDiv = document.getElementById(this.canvasDivName);
	this.renderer = new THREE.WebGLRenderer();
	this.canvasDiv.appendChild(this.renderer.domElement);
	this.canvasDiv.oncontextmenu = function() { return false; };
	this.renderer.setClearColor(0x000000, 1);
	
	//TODO: 2D depth management
	
	this._handleWindowResize();
	
	for (var c = 0; c < this.objects.length; c++)
	{
		if (this.objects[c].added)
			this.objects[c].added();
	}
};

bmacSdk.Engine.prototype._handleWindowResize = function()
{
	this.screenWidth = this.canvasDiv.offsetWidth;
	this.screenHeight = this.canvasDiv.offsetHeight;
	this.renderer.setSize(this.screenWidth, this.screenHeight);
	this.mainCamera.left = -this.screenWidth/2;
	this.mainCamera.right = this.screenWidth/2;
	this.mainCamera.top = -this.screenHeight/2;
	this.mainCamera.bottom = this.screenHeight/2;
	this.mainCamera.updateProjectionMatrix();
}

bmacSdk.Engine.prototype._animate = function()
{
	//Calc mouse pos
	var mousePos = Input.Mouse.getPosition(this.canvasDiv);
	if (!this.mousePosWorld) this.mousePosWorld = new THREE.Vector2();
	this.mousePosWorld.x = mousePos.x + this.mainCamera.position.x;
	this.mousePosWorld.y = mousePos.y + this.mainCamera.position.y;
	
	//Update objects
	for (var c = 0; c < this.objects.length; c++)
	{
		if (this.objects[c].update)
			this.objects[c].update(bmacSdk.deltaSec);
	}
	
	//Render
	this.renderer.render(this.scene, this.mainCamera);
};

bmacSdk._animate = function()
{
	bmacSdk._deltaSec = (Date.now() - bmacSdk._lastFrame) / 1000;
	bmacSdk._lastFrame = Date.now();
	
	requestAnimationFrame(bmacSdk._animate);
	
	if (bmacSdk._eatFrame)
	{
		bmacSdk._eatFrame = false;
		return;
	}
	
	if (bmacSdk.CFG_PAUSE_WHEN_UNFOCUSED && !bmacSdk.isFocused)
	{
		return;
	}
	
	Input.update();
	
	for (var c = 0; c < bmacSdk.engines.length; c++)
	{
		bmacSdk.engines[c]._animate();
	}
};
