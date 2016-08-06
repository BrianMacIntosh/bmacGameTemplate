
THREE = require("three");

module.exports = b2Utils =
{
	B2_SCALE: 50,

	// list of all existing PhysicsLinkedObjects
	AllObjects: [],

	// temporary vector2 used to prevent garbage allocation
	tempVector2: new Box2D.b2Vec2(),
}

b2Utils.filter_all = new Box2D.b2Filter();
b2Utils.filter_all.set_maskBits(0xFFFF);
b2Utils.filter_all.set_categoryBits(0xFFFF);

b2Utils.filter_none = new Box2D.b2Filter();
b2Utils.filter_none.set_maskBits(0);
b2Utils.filter_none.set_categoryBits(0);

b2Utils.staticBodyDef = new Box2D.b2BodyDef();

b2Utils.dynamicBodyDef = new Box2D.b2BodyDef();
b2Utils.dynamicBodyDef.set_type(Box2D.b2_dynamicBody);

// creates an edge shape
// coords: in world units
b2Utils.createEdgeShape = function(x1, y1, x2, y2)
{
	var shape = new Box2D.b2EdgeShape();
	shape.Set(
		new Box2D.b2Vec2(x1/this.B2_SCALE, y1/this.B2_SCALE),
		new Box2D.b2Vec2(x2/this.B2_SCALE, y2/this.B2_SCALE));
	return shape;
}

// creates a rectangle shape
// width and height: in world units
b2Utils.createRectShape = function(w, h)
{
	var shape = new Box2D.b2PolygonShape();
	shape.SetAsBox(0.5 * w/this.B2_SCALE, 0.5 * h/this.B2_SCALE);
	return shape;
}

// creates a circle shape
// radius: in world units
b2Utils.createCircleShape = function(radius)
{
	var shape = new Box2D.b2CircleShape();
	shape.set_m_radius(radius/this.B2_SCALE);
	return shape;
}

// creates a fixture definition
b2Utils.createFixtureDef = function(shape, density, friction, restitution)
{
	var def = new Box2D.b2FixtureDef();
	def.set_shape(shape);
	def.set_density(density);
	def.set_friction(friction);
	def.set_restitution(restitution);
	return def;
}

// creates a static body
b2Utils.createStaticBody = function(world, x, y, fixture)
{
	this.tempVector2.set_x(x/this.B2_SCALE);
	this.tempVector2.set_y(y/this.B2_SCALE);
	this.staticBodyDef.set_position(this.tempVector2);
	var body = world.CreateBody(this.staticBodyDef);
	body.CreateFixture(fixture);
	return body;
}

// creates a dynamic body
b2Utils.createDynamicBody = function(world, x, y, fixture)
{
	this.tempVector2.set_x(x/this.B2_SCALE);
	this.tempVector2.set_y(y/this.B2_SCALE);
	this.dynamicBodyDef.set_position(this.tempVector2);
	var body = world.CreateBody(this.dynamicBodyDef);
	body.CreateFixture(fixture);
	return body;
}

b2Utils.getContactListener = function()
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
}

// NOTE: untested
b2Utils.getContactFilter = function(shouldCollide)
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
}

// if the specified object is involved in the contact, returns the other fixture
b2Utils.getOtherObject = function(contact, linkedObject)
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


// CLASS: base class for an object that has threejs visuals and a Body2D body
// keeps them in sync
// visuals should be parented to 'this.transform'.
b2Utils.PhysicsLinkedObject = function(body)
{
	this.transform = new THREE.Object3D();

	b2Utils.AllObjects.push(this);
	
	if (body)
	{
		this.body = body;
	}
}

b2Utils.PhysicsLinkedObject.prototype.destroy = function()
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

b2Utils.PhysicsLinkedObject.prototype.update = function()
{
	if (this.body)
	{
		var physicsPos = this.body.GetPosition();
		this.transform.position.set(
			physicsPos.get_x()*b2Utils.B2_SCALE, physicsPos.get_y()*b2Utils.B2_SCALE, this.transform.position.z);
		this.transform.rotation.z = this.body.GetAngle();
	}
}

// called by box2d when two objects start touching
b2Utils.PhysicsLinkedObject.prototype.onBeginContact = function(contact, otherFixture)
{

}

// called by box2d when two objects stop touching
b2Utils.PhysicsLinkedObject.prototype.onEndContact = function(contact, otherFixture)
{

}

// called by box2d each frame two bodies are touching, before the response is calculated
// here you can disable the contact
b2Utils.PhysicsLinkedObject.prototype.onPreSolve = function(contact, oldManifold, otherFixture)
{

}

// called by box2d each frame two bodies are touching, after the response is calculated
b2Utils.PhysicsLinkedObject.prototype.onPostSolve = function(contact, impulse, otherFixture)
{

}
