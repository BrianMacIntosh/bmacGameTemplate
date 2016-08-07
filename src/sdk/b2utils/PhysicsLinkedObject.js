
b2Utils = require("./index.js");

/**
 * Base class for an object that has three.js visuals and a Box2D body.
 * Visual elements should be parented to 'this.transform'. The position of
 * 'this.transform' is automatically updated to match the body.
 * @param {Box2D.b2Body} The object's body.
 */
var PhysicsLinkedObject = function(body)
{
	this.transform = new THREE.Object3D();

	b2Utils.AllObjects.push(this);
	
	if (body)
	{
		this.body = body;
	}
}

module.exports = PhysicsLinkedObject;

/**
 * Destroys this object.
 */
PhysicsLinkedObject.prototype.destroy = function()
{
	if (this.transform && this.transform.parent)
	{
		this.transform.parent.remove(this.transform);
		delete this.transform;
	}

	var index = b2Utils.AllObjects.indexOf(this);
	if (index >= 0)
	{
		b2Utils.AllObjects.splice(index, 1);
	}

	if (this.body)
	{
		this.body.GetWorld().DestroyBody(this.body);
		this.body = undefined;
	}
}

/**
 * Updates this object once per frame.
 */
PhysicsLinkedObject.prototype.update = function()
{
	if (this.body)
	{
		var physicsPos = this.body.GetPosition();
		this.transform.position.set(
			physicsPos.get_x()*b2Utils.B2_SCALE, physicsPos.get_y()*b2Utils.B2_SCALE, this.transform.position.z);
		this.transform.rotation.z = this.body.GetAngle();
	}
}

/**
 * Called by box2d when this object starts touching another.
 * @param {Box2D.b2Contact} contact
 * @param {Box2D.b2Fixture} otherFixture
 */
PhysicsLinkedObject.prototype.onBeginContact = function(contact, otherFixture)
{

}

/**
 * Called by box2d when this object stops touching another.
 * @param {Box2D.b2Contact} contact
 * @param {Box2D.b2Fixture} otherFixture
 */
PhysicsLinkedObject.prototype.onEndContact = function(contact, otherFixture)
{

}

/**
 * Called by box2d each frame this body is touching another body, before the response is calculated.
 * The response can be disabled here.
 * @param {Box2D.b2Contact} contact
 * @param {Box2D.b2Manifold} oldManifold
 * @param {Box2D.b2Fixture} otherFixture
 */
PhysicsLinkedObject.prototype.onPreSolve = function(contact, oldManifold, otherFixture)
{

}

/**
 * Called by box2d each frame this body is touching another body, after the response is calculated.
 * @param {Box2D.b2Contact} contact
 * @param {Box2D.b2Impulse} impulse
 * @param {Box2D.b2Fixture} otherFixture
 */
PhysicsLinkedObject.prototype.onPostSolve = function(contact, impulse, otherFixture)
{

}
