
/**
 * @fileOverview Contains utility functions for interacting with Box2D. 
 */

THREE = require("three");

/**
 * @namespace
 */
var b2Utils =
{
	B2_SCALE: 50,

	/**
	 * List of all PhysicsLinkedObject that exist.
	 * @type {Array}
	 */
	AllObjects: [],

	/**
	 * Temporary vector used for math, to prevent garbage allocation. Use only VERY locally.
	 * @type {Box2D.b2Vec2}
	 */
	tempVector2: new Box2D.b2Vec2(),

	/**
	 * Creates an edge shape.
	 * @param {Number} x1 First x coordinate in world units.
	 * @param {Number} y1 First y coordinate in world units.
	 * @param {Number} x2 Second x coordinate in world units.
	 * @param {Number} y2 Second y coordinate in world units.
	 * @returns {Box2D.b2Shape}
	 */
	createEdgeShape: function(x1, y1, x2, y2)
	{
		var shape = new Box2D.b2EdgeShape();
		shape.Set(
			new Box2D.b2Vec2(x1/this.B2_SCALE, y1/this.B2_SCALE),
			new Box2D.b2Vec2(x2/this.B2_SCALE, y2/this.B2_SCALE));
		return shape;
	},

	/**
	 * Creates a rectangle shape.
	 * @param {Number} w The width of the rectangle in world units.
	 * @param {Number} h The height of the rectangle in world units.
	 * @returns {Box2D.b2Shape}
	 */
	createRectShape: function(w, h)
	{
		var shape = new Box2D.b2PolygonShape();
		shape.SetAsBox(0.5 * w/this.B2_SCALE, 0.5 * h/this.B2_SCALE);
		return shape;
	},

	/**
	 * Creates a circle shape.
	 * @param {Number} radius The radius of the circle in world units.
	 * @returns {Box2D.b2Shape}
	 */
	createCircleShape: function(radius)
	{
		var shape = new Box2D.b2CircleShape();
		shape.set_m_radius(radius/this.B2_SCALE);
		return shape;
	},

	/**
	 * Creates a definition that can be used to add fixtures to bodies.
	 * @param {Box2D.b2Shape} shape
	 * @param {Number} density
	 * @param {Number} friction
	 * @param {Number} restitution
	 * @returns {Box2D.b2FixtureDef}
	 */
	createFixtureDef: function(shape, density, friction, restitution)
	{
		var def = new Box2D.b2FixtureDef();
		def.set_shape(shape);
		def.set_density(density);
		def.set_friction(friction);
		def.set_restitution(restitution);
		return def;
	},

	/**
	 * Creates a static body.
	 * @param {Box2D.b2World} world
	 * @param {Number} x The starting x position of the body in world coordinates.
	 * @param {Number} y The starting y position of the body in world coordinates.
	 * @param {Box2D.b2FixtureDef} (Optional) fixtureDef A fixture to add to the body.
	 * @returns {Box2D.b2Body}
	 */
	createStaticBody: function(world, x, y, fixtureDef)
	{
		this.tempVector2.set_x(x/this.B2_SCALE);
		this.tempVector2.set_y(y/this.B2_SCALE);
		this.staticBodyDef.set_position(this.tempVector2);
		var body = world.CreateBody(this.staticBodyDef);
		if (fixtureDef)
		{
			body.CreateFixture(fixtureDef);
		}
		return body;
	},

	/**
	 * Creates a dynamic body.
	 * @param {Box2D.b2World} world
	 * @param {Number} x The starting x position of the body in world coordinates.
	 * @param {Number} y The starting y position of the body in world coordinates.
	 * @param {Box2D.b2FixtureDef} fixtureDef A fixture to add to the body.
	 * @returns {Box2D.b2Body}
	 */
	createDynamicBody: function(world, x, y, fixtureDef)
	{
		this.tempVector2.set_x(x/this.B2_SCALE);
		this.tempVector2.set_y(y/this.B2_SCALE);
		this.dynamicBodyDef.set_position(this.tempVector2);
		var body = world.CreateBody(this.dynamicBodyDef);
		if (fixtureDef)
		{
			body.CreateFixture(fixtureDef);
		}
		return body;
	},

	//TODO: Improve the API for contact filters and contact listeners

	/**
	 * Returns the contact listener for the game.
	 * @returns {Box2D.JSContactListener}
	 */
	getContactListener: function()
	{
		if (this.contactListener)
		{
			return this.contactListener;
		}

		this.contactListener = new Box2D.JSContactListener();
		this.contactListener.BeginContact = function(contact)
		{
			contact = Box2D.wrapPointer(contact, Box2D.b2Contact);
			for (var i = 0; i < b2Utils.AllObjects.length; i++)
			{
				var otherFixture = b2Utils.getOtherObject(contact, b2Utils.AllObjects[i]);
				if (otherFixture)
				{
					b2Utils.AllObjects[i].onBeginContact(contact, otherFixture);
				}
			}
		}
		this.contactListener.EndContact = function(contact)
		{
			contact = Box2D.wrapPointer(contact, Box2D.b2Contact);
			for (var i = 0; i < b2Utils.AllObjects.length; i++)
			{
				var otherFixture = b2Utils.getOtherObject(contact, b2Utils.AllObjects[i]);
				if (otherFixture)
				{
					b2Utils.AllObjects[i].onEndContact(contact, otherFixture);
				}
			}
		}
		this.contactListener.PreSolve = function(contact, oldManifold)
		{
			contact = Box2D.wrapPointer(contact, Box2D.b2Contact);
			oldManifold = Box2D.wrapPointer(oldManifold, Box2D.b2Manifold); //TODO: check me
			for (var i = 0; i < b2Utils.AllObjects.length; i++)
			{
				var otherFixture = b2Utils.getOtherObject(contact, b2Utils.AllObjects[i]);
				if (otherFixture)
				{
					b2Utils.AllObjects[i].onPreSolve(contact, oldManifold, otherFixture);
				}
			}
		}
		this.contactListener.PostSolve = function(contact, impulse)
		{
			contact = Box2D.wrapPointer(contact, Box2D.b2Contact);
			impulse = Box2D.wrapPointer(impulse, Box2D.b2ContactImpulse); //TODO: check me
			for (var i = 0; i < b2Utils.AllObjects.length; i++)
			{
				var otherFixture = b2Utils.getOtherObject(contact, b2Utils.AllObjects[i]);
				if (otherFixture)
				{
					b2Utils.AllObjects[i].onPostSolve(contact, impulse, otherFixture);
				}
			}
		}
		return this.contactListener;
	},

	/**
	 * Returns the contact filter for the game.
	 * @returns {Box2D.JSContactFilter}
	 */
	getContactFilter: function(shouldCollide)
	{
		if (this.contactFilter)
		{
			return this.contactFilter;
		}

		this.contactFilter = new Box2D.JSContactFilter();
		this.contactFilter.ShouldCollide = function(fixtureA, fixtureB)
		{
			fixtureA = Box2D.wrapPointer(fixtureA, Box2D.b2Fixture);
			fixtureB = Box2D.wrapPointer(fixtureB, Box2D.b2Fixture);
			return shouldCollide(fixtureA, fixtureB);
		}
		return this.contactFilter;
	},

	/**
	 * If the specified object is involved in the contact, returns the other fixture involved.
	 * @param {Box2D.b2Contact} contact
	 * @param {PhysicsLinkedObject} linkedObject
	 * @returns {Box2D.b2Fixture}
	 */
	getOtherObject: function(contact, linkedObject)
	{
		if (contact.GetFixtureA().GetBody() == linkedObject.body)
		{
			return contact.GetFixtureB();
		}
		else if (contact.GetFixtureB().GetBody() == linkedObject.body)
		{
			return contact.GetFixtureA();
		}
		else
		{
			return undefined;
		}
	},
}

module.exports = b2Utils;

b2Utils.PhysicsLinkedObject = require("./PhysicsLinkedObject.js");

b2Utils.filter_all = new Box2D.b2Filter();
b2Utils.filter_all.set_maskBits(0xFFFF);
b2Utils.filter_all.set_categoryBits(0xFFFF);

b2Utils.filter_none = new Box2D.b2Filter();
b2Utils.filter_none.set_maskBits(0);
b2Utils.filter_none.set_categoryBits(0);

b2Utils.staticBodyDef = new Box2D.b2BodyDef();

b2Utils.dynamicBodyDef = new Box2D.b2BodyDef();
b2Utils.dynamicBodyDef.set_type(Box2D.b2_dynamicBody);
