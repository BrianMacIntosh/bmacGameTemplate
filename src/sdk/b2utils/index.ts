
/**
 * @fileOverview Contains utility functions for interacting with Box2D. 
 */

import THREE = require("three");

import { PhysicsLinkedObject } from "./PhysicsLinkedObject";
import { Box2D } from "../../thirdparty/box2d";

export { PhysicsLinkedObject } from "./PhysicsLinkedObject";

export namespace b2Utils
{
	export var B2_SCALE: number = 50

	/**
	 * List of all PhysicsLinkedObject that exist.
	 * @type {PhysicsLinkedObject[]}
	 */
	export var AllObjects: PhysicsLinkedObject[] = []

	/**
	 * Temporary vector used for math, to prevent garbage allocation. Use only VERY locally.
	 * @type {Box2D.b2Vec2}
	 */
	export var tempVector2: Box2D.b2Vec2 = new Box2D.b2Vec2();

	export var filter_all = new Box2D.b2FilterData();
	filter_all.maskBits = 0xFFFF;
	filter_all.categoryBits = 0xFFFF;

	export var filter_none = new Box2D.b2FilterData();
	filter_none.maskBits = 0;
	filter_none.categoryBits = 0;

	export var staticBodyDef = new Box2D.b2BodyDef();

	export var dynamicBodyDef = new Box2D.b2BodyDef();
	dynamicBodyDef.type = Box2D.b2Body.b2_kinematicBody;

	var contactFilter: Box2D.b2ContactFilter;
	var contactListener: Box2D.b2ContactListener;

	/**
	 * Creates an edge shape.
	 * @param {number} x1 First x coordinate in world units.
	 * @param {number} y1 First y coordinate in world units.
	 * @param {number} x2 Second x coordinate in world units.
	 * @param {number} y2 Second y coordinate in world units.
	 * @returns {Box2D.b2Shape}
	 */
	export function createEdgeShape(x1: number, y1: number, x2: number, y2: number): Box2D.b2EdgeShape
	{
		var shape = new Box2D.b2EdgeShape(
			new Box2D.b2Vec2(x1/B2_SCALE, y1/B2_SCALE),
			new Box2D.b2Vec2(x2/B2_SCALE, y2/B2_SCALE));
		return shape;
	}

	/**
	 * Creates a rectangle shape.
	 * @param {number} w The width of the rectangle in world units.
	 * @param {number} h The height of the rectangle in world units.
	 * @returns {Box2D.b2Shape}
	 */
	export function createRectShape(w: number, h: number): Box2D.b2PolygonShape
	{
		var shape = new Box2D.b2PolygonShape();
		shape.SetAsBox(0.5 * w/B2_SCALE, 0.5 * h/B2_SCALE);
		return shape;
	}

	/**
	 * Creates a circle shape.
	 * @param {number} radius The radius of the circle in world units.
	 * @returns {Box2D.b2Shape}
	 */
	export function createCircleShape(radius: number)
	{
		var shape = new Box2D.b2CircleShape();
		shape.SetRadius(radius/B2_SCALE);
		return shape;
	}

	/**
	 * Creates a definition that can be used to add fixtures to bodies.
	 * @param {Box2D.b2Shape} shape
	 * @param {number} density
	 * @param {number} friction
	 * @param {number} restitution
	 * @returns {Box2D.b2FixtureDef}
	 */
	export function createFixtureDef(shape: Box2D.b2Shape, density: number, friction: number, restitution: number)
	{
		var def = new Box2D.b2FixtureDef();
		def.shape = shape;
		def.density = density;
		def.friction = friction;
		def.restitution = restitution;
		return def;
	}

	/**
	 * Creates a static body.
	 * @param {Box2D.b2World} world
	 * @param {number} x The starting x position of the body in world coordinates.
	 * @param {number} y The starting y position of the body in world coordinates.
	 * @param {Box2D.b2FixtureDef} fixtureDef (Optional) fixtureDef A fixture to add to the body.
	 * @param {Box2D.b2BodyDef} bodyDef (Optional) definition to use for the body
	 * @returns {Box2D.b2Body}
	 */
	export function createStaticBody(world, x, y, fixtureDef, bodyDef)
	{
		if (!bodyDef) bodyDef = staticBodyDef;
		tempVector2.x = x / B2_SCALE;
		tempVector2.y = y / B2_SCALE;
		bodyDef.set_position(tempVector2);
		var body = world.CreateBody(bodyDef);
		if (fixtureDef)
		{
			body.CreateFixture(fixtureDef);
		}
		return body;
	}

	/**
	 * Creates a dynamic body.
	 * @param {Box2D.b2World} world
	 * @param {number} x The starting x position of the body in world coordinates.
	 * @param {number} y The starting y position of the body in world coordinates.
	 * @param {Box2D.b2FixtureDef} fixtureDef (Optional) A fixture to add to the body.
	 * @param {Box2D.b2BodyDef} bodyDef (Optional) definition to use for the body
	 * @returns {Box2D.b2Body}
	 */
	export function createDynamicBody(world, x, y, fixtureDef, bodyDef)
	{
		if (!bodyDef) bodyDef = dynamicBodyDef;
		tempVector2.x = x / B2_SCALE;
		tempVector2.y = y / B2_SCALE;
		bodyDef.set_position(tempVector2);
		var body = world.CreateBody(bodyDef);
		if (fixtureDef)
		{
			body.CreateFixture(fixtureDef);
		}
		return body;
	}
	
	class ContactListener extends Box2D.b2ContactListener
	{
		public BeginContact(contact: Box2D.b2Contact)
		{
			for (var i = 0; i < b2Utils.AllObjects.length; i++)
			{
				var otherFixture = b2Utils.getOtherObject(contact, b2Utils.AllObjects[i]);
				if (otherFixture)
				{
					b2Utils.AllObjects[i].onBeginContact(contact, otherFixture);
				}
			}
		}
		
		public EndContact(contact: Box2D.b2Contact)
		{
			for (var i = 0; i < b2Utils.AllObjects.length; i++)
			{
				var otherFixture = b2Utils.getOtherObject(contact, b2Utils.AllObjects[i]);
				if (otherFixture)
				{
					b2Utils.AllObjects[i].onEndContact(contact, otherFixture);
				}
			}
		}

		public PreSolve(contact: Box2D.b2Contact, oldManifold: Box2D.b2Manifold)
		{
			for (var i = 0; i < b2Utils.AllObjects.length; i++)
			{
				var otherFixture = b2Utils.getOtherObject(contact, b2Utils.AllObjects[i]);
				if (otherFixture)
				{
					b2Utils.AllObjects[i].onPreSolve(contact, oldManifold, otherFixture);
				}
			}
		}

		public PostSolve(contact: Box2D.b2Contact, impulse: Box2D.b2ContactImpulse)
		{
			for (var i = 0; i < b2Utils.AllObjects.length; i++)
			{
				var otherFixture = b2Utils.getOtherObject(contact, b2Utils.AllObjects[i]);
				if (otherFixture)
				{
					b2Utils.AllObjects[i].onPostSolve(contact, impulse, otherFixture);
				}
			}
		}
	}

	/**
	 * Returns the contact filter for the game.
	 * @returns {Box2D.b2ContactFilter}
	 */
	export function getContactFilter(shouldCollide)
	{
		if (!contactFilter)
		{
			contactFilter = new ContactFilter(shouldCollide);
		}
		return contactFilter;
	}

	class ContactFilter extends Box2D.b2ContactFilter
	{
		constructor (private shouldCollide: any) //TODO: predicate
		{
			super();
		}

		public ShouldCollide(fixtureA: Box2D.b2Fixture, fixtureB: Box2D.b2Fixture): boolean
		{
			return this.shouldCollide(fixtureA, fixtureB);
		}
	}

	/**
	 * If the specified object is involved in the contact, returns the other fixture involved.
	 * @param {Box2D.b2Contact} contact
	 * @param {PhysicsLinkedObject} linkedObject
	 * @returns {Box2D.b2Fixture}
	 */
	export function getOtherObject(contact, linkedObject)
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
	}
}
