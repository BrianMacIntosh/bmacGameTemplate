
var THREE = require("three");
var b2Utils = require("../b2utils");

/**
 * An object that manages drawing debug shapes for bodies in a Box2D world.
 * @namespace
 */
module.exports = b2Debugger =
{
	// nested array, indexed by vert count
	meshes: {},

	transform: new THREE.Object3D(),

	e_shapeBit: 0x0001, ///< draw shapes
	e_jointBit: 0x0002, ///< draw joint connections
	e_coreShapeBit: 0x0004, ///< draw core (TOI) shapes
	e_aabbBit: 0x0008, ///< draw axis aligned bounding boxes
	e_obbBit: 0x0010, ///< draw oriented bounding boxes
	e_pairBit: 0x0020, ///< draw broad-phase pairs
	e_centerOfMassBit: 0x0040, ///< draw center of mass frame

	getGeometry: function(color, vertCount)
	{
		if (!this.meshes[vertCount])
		{
			this.meshes[vertCount] = [];
			this.meshes[vertCount].current = 0;
		}

		var pool = this.meshes[vertCount];

		var index = this.meshes[vertCount].current++;
		if (!pool[index])
		{
			var geometry = new THREE.Geometry();
			geometry.dynamic = true;
			for (var i = 0; i < vertCount; i++)
			{
				geometry.vertices.push(new THREE.Vector3());
			}

			var material = new THREE.LineBasicMaterial({ color: 0xffffff });
			var mesh = new THREE.Line(geometry, material);

			pool[index] = mesh;
			this.transform.add(mesh);
		}
		else
		{
			var mesh = pool[index];
			var material = pool[index].material;
			var geometry = pool[index].geometry;
		}

		// set material color
		color = Box2D.wrapPointer(color, Box2D.b2Color);
		material.color.setRGB(color.get_r(), color.get_g(), color.get_b());

		mesh.visible = true;

		return geometry;
	},

	startDrawing: function()
	{
		// reset mesh counters
		for (var i in this.meshes)
		{
			this.meshes[i].current = 0;
		}
	},

	finishDrawing: function()
	{
		// hide excess meshes
		for (var i in this.meshes)
		{
			for (; this.meshes[i].current < this.meshes[i].length; this.meshes[i].current++)
			{
				this.meshes[i][this.meshes[i].current].visible = false;
			}
		}
	},

	getDebugDraw: function()
	{
		var debugDraw = new Box2D.JSDraw();
		debugDraw.SetFlags(this.e_shapeBit);

		debugDraw.DrawSegment = function(vert1, vert2, color)
		{
			vert1 = Box2D.wrapPointer(vert1, Box2D.b2Vec2);
			vert2 = Box2D.wrapPointer(vert2, Box2D.b2Vec2);
			var geometry = b2Debugger.getGeometry(color, 2);

			var x1 = vert1.get_x() * b2Utils.B2_SCALE;
			var y1 = vert1.get_y() * b2Utils.B2_SCALE;
			var x2 = vert2.get_x() * b2Utils.B2_SCALE;
			var y2 = vert2.get_y() * b2Utils.B2_SCALE;

			geometry.vertices[0].set(x1, y1, 0);
			geometry.vertices[1].set(x2, y2, 0);

			geometry.verticesNeedUpdate = true;
			geometry.computeBoundingSphere();
		};

		debugDraw.DrawPolygon = function(vertices, vertexCount, color)
		{
			var geometry = b2Debugger.getGeometry(color, vertexCount + 1);

			for (var i = 0; i < vertexCount; i++)
			{
				var vert = Box2D.wrapPointer(vertices+(i*8), Box2D.b2Vec2);

				var x = vert.get_x() * b2Utils.B2_SCALE;
				var y = vert.get_y() * b2Utils.B2_SCALE;
				geometry.vertices[i].set(x, y, 0);
			}

			// close by drawing the first vert again
			var vert = Box2D.wrapPointer(vertices, Box2D.b2Vec2);
			var x = vert.get_x() * b2Utils.B2_SCALE;
			var y = vert.get_y() * b2Utils.B2_SCALE;
			geometry.vertices[i].set(x, y, 0);

			geometry.verticesNeedUpdate = true;
			geometry.computeBoundingSphere();
		};

		debugDraw.DrawSolidPolygon = function(vertices, vertexCount, color)
		{
			//TODO:
			this.DrawPolygon(vertices, vertexCount, color);
		};

		debugDraw.DrawCircle = function(center, radius, color)
		{
			var circleRes = 16;
			var geometry = b2Debugger.getGeometry(color, circleRes + 1);

			var center = Box2D.wrapPointer(center, Box2D.b2Vec2);
			var cx = center.get_x() * b2Utils.B2_SCALE;
			var cy = center.get_y() * b2Utils.B2_SCALE;

			for (var i = 0; i < circleRes; i++)
			{
				var angle = i * Math.PI * 2 / circleRes;
				var x = Math.cos(angle) * radius * b2Utils.B2_SCALE + cx;
				var y = Math.sin(angle) * radius * b2Utils.B2_SCALE + cy;
				geometry.vertices[i].set(x, y, 0);
			}

			// close by drawing the first vert again
			var x = Math.cos(0) * radius * b2Utils.B2_SCALE + cx;
			var y = Math.sin(0) * radius * b2Utils.B2_SCALE + cy;
			geometry.vertices[i].set(x, y, 0);

			geometry.verticesNeedUpdate = true;
			geometry.computeBoundingSphere();
		};

		debugDraw.DrawSolidCircle = function(center, radius, axis, color)
		{
			//TODO:
			this.DrawCircle(center, radius, color);
		};

		debugDraw.DrawTransform = function(transform)
		{
			//TODO:
		};

		return debugDraw;
	}
}
