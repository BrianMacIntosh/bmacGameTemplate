
THREE = require("three");

/** @namespace */
var ThreeUtils = 
{
	c_planeCorrection: new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(Math.PI, 0, 0)),
	
	textureLoader: new THREE.TextureLoader(),

	// if set, all calls return dummy objects instead of real visual objects
	serverMode: false,

	Atlas: require("./Atlas.js"),

	/**
	 * Creates a THREE.Mesh with a unique material.
	 * @param {THREE.Texture} texture Texture for the mesh.
	 * @param {THREE.Geometry} geometry Geometry for the mesh.
	 * @returns {THREE.Mesh}
	 */
	makeSpriteMesh: function(texture, geometry)
	{
		if (this.serverMode)
		{
			return new THREE.Object3D();
		}
		else
		{
			var material = new THREE.MeshBasicMaterial({ map:texture, transparent:true });
			var mesh = new THREE.Mesh(geometry, material);
			return mesh;
		}
	},

	/**
	 * Creates a plane mesh with the specified dimensions.
	 * @param {Number} width The width of the plane.
	 * @param {Number} height The height of the plane.
	 * @returns {THREE.Geometry}
	 */
	makeSpriteGeo: function(width, height)
	{
		var geo = new THREE.PlaneGeometry(width, height);
		geo.applyMatrix(ThreeUtils.c_planeCorrection);
		return geo;
	},

	/**
	 * Calculates the distance between two THREE.Object3D or THREE.Vector3.
	 * @param {THREE.Object3D} thing1
	 * @param {THREE.Object3D} thing2
	 * @returns {Number}
	 */
	distance: function(thing1, thing2)
	{
		return Math.sqrt(ThreeUtils.distanceSq(thing1, thing2));
	},

	/**
	 * Calculates the squared distance between two THREE.Object3D or THREE.Vector3.
	 * @param {THREE.Object3D|THREE.Vector3} thing1
	 * @param {THREE.Object3D|THREE.Vector3} thing2
	 * @returns {Number}
	 */
	distanceSq: function(thing1, thing2)
	{
		var x1 = thing1.position !== undefined ? thing1.position.x : thing1.x;
		var y1 = thing1.position !== undefined ? thing1.position.y : thing1.y;
		var x2 = thing2.position !== undefined ? thing2.position.x : thing1.x;
		var y2 = thing2.position !== undefined ? thing2.position.y : thing1.y;
		var dx = x1-x2;
		var dy = y1-y2;
		return dx*dx+dy*dy;
	},

	/**
	 * Loads the specified texture. Caches repeated calls.
	 * @param {string} url The URL of the texture.
	 * @returns {THREE.Texture}
	 */
	loadTexture: function(url)
	{
		if (this.serverMode)
		{
			return undefined;
		}
		if (this.textureCache === undefined)
		{
			this.textureCache = {};
		}
		if (this.textureCache[url])
		{
			return this.textureCache[url];
		}
		else
		{
			this.textureCache[url] = this.textureLoader.load(url);
			return this.textureCache[url];
		}
	},

	/**
	 * Sets the texture as okay to be non-power-of-two.
	 * @param {THREE.Texture} texture
	 * @returns {THREE.Texture}
	 */
	setTextureNpot: function(texture)
	{
		if (texture)
		{
			texture.generateMipmaps = false
			texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
			texture.minFilter = texture.maxFilter = THREE.NearestFilter;
		}
		return texture;
	},

	/**
	 * Sets the UVs of the geometry to display the specified tile.
	 * @param {THREE.Geometry} geometry
	 * @param {Number} x The x index of the tile.
	 * @param {Number} y The y index of the tile.
	 * @param {Number} countX The number of tiles horizontally on the image.
	 * @param {Number} countY The number of tiles vertically on the image.
	 * @param {Boolean} flipX Flip the image horizontally?
	 * @param {Boolean} flipY Flip the image vertically?
	 * @returns {THREE.Geometry}
	 */
	setTilesheetGeometry: function(geometry, x, y, countX, countY, flipX, flipY)
	{
		uvs = geometry.faceVertexUvs[0];
		var l = x/countX;
		var b = 1-y/countY;
		var r = (x+1)/countX;
		var t = 1-(y+1)/countY;
		if (flipX){var temp=l;l=r;r=temp;}
		if (flipY){var temp=t;t=b;b=temp;}
		uvs[0][0].set(l,b);
		uvs[0][1].set(l,t);
		uvs[0][2].set(r,b);
		uvs[1][0].set(l,t);
		uvs[1][1].set(r,t);
		uvs[1][2].set(r,b);
		geometry.uvsNeedUpdate = true;
		return geometry;
	},

	/**
	 * Sets an HTML div to display an image in an atlas.
	 * @param {Element} element The element to configure.
	 * @param {Atlas} atlas The atlas to us.
	 * @param {string} key The key to use from the atlas.
	 * @returns {Element}
	 */
	setElementToAtlasImage: function(element, atlas, key)
	{
		// set icon using background position
		var atlasCoords = atlas.sprites[key];
		if (atlasCoords === undefined)
		{
			atlasCoords = atlas.sprites["missing"];
		}
		if (atlasCoords !== undefined)
		{
			element.style["background-image"] = "url(\"" + atlas.url + "\")";
			element.style["background-position"] = (-atlasCoords[0]) + "px " + (-atlasCoords[1]) + "px";
			element.style["width"] = atlasCoords[2] + "px";
			element.style["height"] = atlasCoords[3] + "px";
		}
		return element;
	},

	/**
	 * Creates a mesh for the given sprite in the atlas.
	 * @param {ThreeUtils.Atlas} atlas
	 * @param {string} key
	 * @param {Boolean} dynamic Set if you want to be able to flip the sprite or dynamically switch its texture.
	 */
	makeAtlasMesh: function(atlas, key, dynamic)
	{
		if (atlas.data[key] === undefined)
		{
			console.error("Atlas '"+atlas.url+"' has no key '"+key+"'.");
			return null;
		}
		if (!atlas.data[key].geo)
		{
			atlas.data[key].geo = this.makeSpriteGeo(atlas.data[key][2],atlas.data[key][3]);
			this._setAtlasUVs(atlas.data[key].geo,atlas,key);
		}
		var geo = atlas.data[key].geo
		if (dynamic)
		{
			geo = geo.clone();
			geo.dynamic = true;
			geo.atlas_flipx=false;
			geo.atlas_flipy=false;
		}
		var mesh = ThreeUtils.makeSpriteMesh(atlas.texture,geo);
		mesh.atlas = atlas;
		mesh.atlas_key = key;
		return mesh;
	},

	_setAtlasUVs: function(geo,atlas,key,flipX,flipY)
	{
		if (!atlas)
		{
			console.error("Geometry is not atlased.");
			return;
		}
		if (atlas.data[key] === undefined)
		{
			console.error("Atlas '"+atlas.url+"' has not key '"+key+"'");
			return;
		}
		
		uvs = geo.faceVertexUvs[0];
		var l = atlas.data[key][0]/atlas.width;
		var b = (1-atlas.data[key][1]/atlas.height);
		var r = l+atlas.data[key][2]/atlas.width;
		var t = b-atlas.data[key][3]/atlas.height;
		if (geo.atlas_flipx){var temp=l;l=r;r=temp;}
		if (geo.atlas_flipy){var temp=t;t=b;b=temp;}
		uvs[0][0].set(l,b);
		uvs[0][1].set(l,t);
		uvs[0][2].set(r,b);
		uvs[1][0].set(l,t);
		uvs[1][1].set(r,t);
		uvs[1][2].set(r,b);
		geo.uvsNeedUpdate = true;
		
		verts = geo.vertices;
		
		geo.verticesNeedUpdate = true;
	},

	/**
	 * Sets the UVs of the specified geometry to display the specified atlas sprite.
	 * @param {THREE.Geometry} geometry
	 * @param {ThreeUtils.Atlas} atlas
	 * @param {string} key
	 * @param {Boolean} flipX
	 * @param {Boolean} flipY
	 */
	setAtlasGeometry: function(geometry, atlas, key, flipX, flipY)
	{
		if (!atlas)
		{
			console.error("Geometry is not atlased.");
			return;
		}
		if (atlas.data[key] === undefined)
		{
			console.error("Atlas '"+atlas.url+"' has not key '"+key+"'");
			return;
		}
		this._setAtlasUVs(geometry,atlas,key,flipX,flipY);
		
		var w = atlas.data[key][2]/2;
		var h = atlas.data[key][3]/2;
		verts = geometry.vertices;
		verts[0].set(-w,-h,0);
		verts[1].set(w,-h,0);
		verts[2].set(-w,h,0);
		verts[3].set(w,h,0);
		geometry.verticesNeedUpdate = true;
	},

	/**
	 * Sets the flipped state of the specified atlas mesh.
	 * @param {THREE.Mesh} mesh
	 * @param {Boolean} flipX
	 * @param {Boolean} flipY
	 */
	setAtlasMeshFlip: function(mesh, flipX, flipY)
	{
		if (!mesh.geometry)
		{
			return;
		}
		if (!mesh.geometry.dynamic)
		{
			console.error("Geometry is not dynamic.");return;
		}
		if (flipX == mesh.geometry.atlas_flipx && flipY == mesh.geometry.atlas_flipy) return;
		mesh.geometry.atlas_flipx=flipX;
		mesh.geometry.atlas_flipy=flipY;
		this._setAtlasUVs(mesh.geometry,mesh.atlas,mesh.atlas_key);
	},

	/**
	 * Sets the UVs of the specified atlas mesh to the specified sprite key.
	 * @param {THREE.Mesh} mesh
	 * @param {string} key
	 */
	setAtlasMeshKey: function(mesh, key)
	{
		if (!mesh.geometry)
		{
			return;
		}
		if (!mesh.geometry.dynamic)
		{
			console.error("Geometry is not dynamic.");return;
		}
		if (key === mesh.atlas_key) return;
		mesh.atlas_key = key;
		this.setAtlasGeometry(mesh.geometry,mesh.atlas,mesh.atlas_key);
	},

	/**
	 * Returns true if the line passing through a and b intersects the specified circle.
	 * @param {Number} a
	 * @param {Number} b
	 * @param {THREE.Vector2} center The center of the circle.
	 * @param {Number} radius The radius of the circle.
	 */
	lineCircleIntersection: function(a, b, center, radius)
	{
		var attackVector = new THREE.Vector3().copy(b).sub(a);
		var meToTargetVector = new THREE.Vector3().copy(center).sub(a);
		attackVector.z = meToTargetVector.z = 0;
		attackVector = meToTargetVector.projectOnVector(attackVector);
		attackVector = attackVector.sub(center).add(a);
		attackVector.z = 0;
		return attackVector.lengthSq() <= radius * radius;
	},

	/**
	 * Returns true if the line segment from a to b intersects the specified circle.
	 * @param {Number} a
	 * @param {Number} b
	 * @param {THREE.Vector2} center The center of the circle.
	 * @param {Number} radius The radius of the circle.
	 */
	lineSegmentCircleIntersection: function(a, b, center, radius)
	{
		var attackVector = new THREE.Vector3().copy(b).sub(a);
		var segmentLengthSq = attackVector.lengthSq();
		var meToTargetVector = new THREE.Vector3().copy(center).sub(a);
		attackVector.z = meToTargetVector.z = 0;
		attackVector = meToTargetVector.projectOnVector(attackVector);
		
		var d = meToTargetVector.dot(attackVector);
		
		// circle is behind the segment
		if (d < 0) return false;
		
		attackVector.normalize().multiplyScalar(d);
		
		// check that the segment range is correct
		var projectionLengthSq = attackVector.lengthSq();
		if (projectionLengthSq > segmentLengthSq)
		{
			return false;
		}
		
		// check that the line is within the circle
		attackVector = attackVector.sub(center).add(a);
		attackVector.z = 0;
		return attackVector.lengthSq() <= radius * radius;
	}
};

module.exports = ThreeUtils;

THREE.Vector2.ZeroVector = new THREE.Vector2();

THREE.Vector3.ZeroVector = new THREE.Vector3();
THREE.Vector3.ForwardVector = new THREE.Vector3(0, 0, 1);
THREE.Vector3.BackVector = new THREE.Vector3(0, 0, -1);
THREE.Vector3.LeftVector = new THREE.Vector3(-1, 0, 0);
THREE.Vector3.RightVector = new THREE.Vector3(1, 0, 0);
THREE.Vector3.UpVector = new THREE.Vector3(0, -1, 0);
THREE.Vector3.DownVector = new THREE.Vector3(0, 1, 0);
