
import THREE = require("three");

import { Atlas } from "./Atlas";

export { Atlas } from "./Atlas";
export { ThreeJsDebugDraw } from "./threejsdebugdraw";

export module ThreeUtils
{
	export var c_planeCorrection: THREE.Matrix4 = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(Math.PI, 0, 0));
	
	export var textureLoader = new THREE.TextureLoader();

	export var tempVector2: THREE.Vector2 = new THREE.Vector2();

	export var tempVector3: THREE.Vector3 = new THREE.Vector3();

	/**
	 * If set, all mesh creation calls return dummy objects instead of real visual objects.
	 * @type {boolean}
	 */
	export var serverMode: boolean = false;

	var textureCache: { [s: string]: THREE.Texture } = {};

	var atlasCache: { [s: string]: Atlas } = {};

	/**
	 * Creates a THREE.Mesh with a unique material.
	 * @param {THREE.Texture} texture Texture for the mesh.
	 * @param {THREE.Geometry} geometry Geometry for the mesh.
	 * @returns {THREE.Object3D}
	 */
	export function makeSpriteMesh(texture: THREE.Texture, geometry: THREE.Geometry): THREE.Mesh
	{
		if (!(geometry instanceof THREE.Geometry))
		{
			console.error("'geometry' is not a THREE.Geometry.");
			console.log(geometry);
			return;
		}
		
		if (serverMode)
		{
			return new THREE.Object3D() as THREE.Mesh;
		}
		else
		{
			var material = new THREE.MeshBasicMaterial({ map:texture, transparent:true });
			var mesh = new THREE.Mesh(geometry, material);
			return mesh;
		}
	};

	/**
	 * Creates a plane mesh with the specified dimensions.
	 * @param {number} width The width of the plane.
	 * @param {number} height The height of the plane.
	 * @returns {THREE.Geometry}
	 */
	export function makeSpriteGeo(width: number, height: number): THREE.Geometry
	{
		var geo = new THREE.PlaneGeometry(width, height);
		geo.applyMatrix(ThreeUtils.c_planeCorrection);
		return geo;
	};

	/**
	 * Calculates the distance between two THREE.Object3D or THREE.Vector3.
	 * @param {THREE.Object3D} thing1
	 * @param {THREE.Object3D} thing2
	 * @returns {number}
	 */
	export function distance(thing1: THREE.Object3D, thing2: THREE.Object3D): number
	{
		return Math.sqrt(ThreeUtils.distanceSq(thing1, thing2));
	};

	/**
	 * Calculates the squared distance between two THREE.Object3D or THREE.Vector3.
	 * @param {THREE.Object3D|THREE.Vector3} thing1
	 * @param {THREE.Object3D|THREE.Vector3} thing2
	 * @returns {number}
	 */
	export function distanceSq(thing1: any, thing2: any): number
	{
		var x1 = thing1.position !== undefined ? thing1.position.x : thing1.x;
		var y1 = thing1.position !== undefined ? thing1.position.y : thing1.y;
		var x2 = thing2.position !== undefined ? thing2.position.x : thing1.x;
		var y2 = thing2.position !== undefined ? thing2.position.y : thing1.y;
		var dx = x1-x2;
		var dy = y1-y2;
		return dx*dx+dy*dy;
	};

	/**
	 * Loads the specified texture. Caches repeated calls.
	 * @param {string} url The URL of the texture.
	 * @returns {THREE.Texture}
	 */
	export function loadTexture(url: string): THREE.Texture
	{
		if (serverMode)
		{
			return undefined;
		}
		if (textureCache[url])
		{
			return textureCache[url];
		}
		else
		{
			textureCache[url] = textureLoader.load(url);
			return textureCache[url];
		}
	};

	/**
	 * Sets the texture as okay to be non-power-of-two.
	 * @param {THREE.Texture} texture
	 * @returns {THREE.Texture}
	 */
	export function setTextureNpot(texture: THREE.Texture): THREE.Texture
	{
		if (texture)
		{
			texture.generateMipmaps = false
			texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
			texture.minFilter = texture.magFilter = THREE.NearestFilter;
		}
		return texture;
	};

	/**
	 * Sets the UVs of the geometry to display the specified tile.
	 * @param {THREE.Geometry} geometry
	 * @param {number} x The x index of the tile.
	 * @param {number} y The y index of the tile.
	 * @param {number} countX The number of tiles horizontally on the image.
	 * @param {number} countY The number of tiles vertically on the image.
	 * @param {boolean} flipX Flip the image horizontally?
	 * @param {boolean} flipY Flip the image vertically?
	 * @returns {THREE.Geometry}
	 */
	export function setTilesheetGeometry(geometry,
		x: number, y: number,
		countX: number, countY: number,
		flipX: boolean, flipY: boolean): THREE.Geometry
	{
		var uvs = geometry.faceVertexUvs[0];
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
	};

	/**
	 * Loads the atlas represented by the specified key or returns a cached version.
	 * @param key {string}
	 * @returns {Atlas}
	 */
	export function loadAtlas(key: string): Atlas
	{
		var allData = require("../../../data/atlases.json");
		var atlasData = allData[key];
		if (atlasData)
		{
			if (!atlasCache[atlasData.url])
			{
				atlasCache[atlasData.url] = new Atlas(atlasData);
			}
			return atlasCache[atlasData.url];
		}
		else
		{
			console.error("Tried to load unknown atlas '" + key + "'.");
			return null;
		}
	};

	/**
	 * Sets an HTML div to display an image in an atlas.
	 * @param {HTMLElement} element The element to configure.
	 * @param {Atlas} atlas The atlas to us.
	 * @param {string} key The key to use from the atlas.
	 * @returns {HTMLElement}
	 */
	export function setElementToAtlasImage(element: HTMLElement, atlas: Atlas, key: string): HTMLElement
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
	};

	/**
	 * Creates a mesh for the given sprite in the atlas.
	 * @param {ThreeUtils.Atlas} atlas
	 * @param {string} key
	 * @param {boolean} dynamic Set if you want to be able to flip the sprite or dynamically switch its texture.
	 */
	export function makeAtlasMesh(atlas: Atlas, key: string, dynamic: boolean): THREE.Object3D
	{
		if (atlas.sprites[key] === undefined)
		{
			console.error("Atlas '"+atlas.url+"' has no key '"+key+"'.");
			return null;
		}
		if (!atlas.sprites[key].geo)
		{
			atlas.sprites[key].geo = makeSpriteGeo(atlas.sprites[key][2],atlas.sprites[key][3]);
			_setAtlasUVs(atlas.sprites[key].geo, atlas, key);
		}
		var geo = atlas.sprites[key].geo
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
	};

	function _setAtlasUVs(
		geometry: THREE.Geometry,
		atlas: Atlas, key: string,
		flipX?: boolean, flipY?: boolean): THREE.Geometry
	{
		if (!atlas)
		{
			console.error("Geometry is not atlased.");
			return;
		}
		if (atlas.sprites[key] === undefined)
		{
			console.error("Atlas '"+atlas.url+"' has not key '"+key+"'");
			return;
		}
		
		var uvs = geometry.faceVertexUvs[0];
		var l = atlas.sprites[key][0]/atlas.width;
		var b = (1-atlas.sprites[key][1]/atlas.height);
		var r = l+atlas.sprites[key][2]/atlas.width;
		var t = b-atlas.sprites[key][3]/atlas.height;
		if (geometry.atlas_flipx){var temp=l;l=r;r=temp;}
		if (geometry.atlas_flipy){var temp=t;t=b;b=temp;}
		uvs[0][0].set(l,b);
		uvs[0][1].set(l,t);
		uvs[0][2].set(r,b);
		uvs[1][0].set(l,t);
		uvs[1][1].set(r,t);
		uvs[1][2].set(r,b);
		geometry.uvsNeedUpdate = true;
		return geometry;
	};

	/**
	 * Sets the UVs of the specified geometry to display the specified atlas sprite.
	 * @param {THREE.Geometry} geometry
	 * @param {ThreeUtils.Atlas} atlas
	 * @param {string} key
	 * @param {boolean} flipX
	 * @param {boolean} flipY
	 */
	export function setAtlasGeometry(
		geometry: THREE.Geometry,
		atlas: Atlas, key: string,
		flipX?: boolean, flipY?: boolean): THREE.Geometry
	{
		if (!atlas)
		{
			console.error("Geometry is not atlased.");
			return;
		}
		if (atlas.sprites[key] === undefined)
		{
			console.error("Atlas '"+atlas.url+"' has not key '"+key+"'");
			return;
		}
		_setAtlasUVs(geometry,atlas,key,flipX,flipY);
		
		var w = atlas.sprites[key][2]/2;
		var h = atlas.sprites[key][3]/2;
		var verts = geometry.vertices;
		verts[0].set(-w,-h,0);
		verts[1].set(w,-h,0);
		verts[2].set(-w,h,0);
		verts[3].set(w,h,0);
		geometry.verticesNeedUpdate = true;
		return geometry;
	};

	/**
	 * Sets the flipped state of the specified atlas mesh.
	 * @param {THREE.Mesh} mesh
	 * @param {boolean} flipX
	 * @param {boolean} flipY
	 */
	export function setAtlasMeshFlip(mesh: THREE.Mesh, flipX: boolean, flipY: boolean): THREE.Mesh
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
		_setAtlasUVs(mesh.geometry, mesh.atlas, mesh.atlas_key);
		return mesh;
	};

	/**
	 * Sets the UVs of the specified atlas mesh to the specified sprite key.
	 * @param {THREE.Mesh} mesh
	 * @param {string} key
	 */
	export function setAtlasMeshKey(mesh: THREE.Mesh, key: string): THREE.Mesh
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
		setAtlasGeometry(mesh.geometry, mesh.atlas, mesh.atlas_key);
		return mesh;
	};

	/**
	 * Returns true if the line passing through a and b intersects the specified circle.
	 * @param {THREE.Vector2} a
	 * @param {THREE.Vector2} b
	 * @param {THREE.Vector2} center The center of the circle.
	 * @param {number} radius The radius of the circle.
	 */
	export function lineCircleIntersection(a: THREE.Vector2, b: THREE.Vector2, center: THREE.Vector2, radius: number): boolean
	{
		var attackVector = new THREE.Vector2().set(b.x - a.x, b.y - a.y);
		var meToTargetVector = new THREE.Vector2().set(center.x - a.x, center.y - a.y);
		attackVector = attackVector.clone().normalize().multiplyScalar(meToTargetVector.dot(attackVector));
		attackVector = attackVector.sub(center).add(a);
		return attackVector.lengthSq() <= radius * radius;
	};

	/**
	 * Returns true if the line segment from a to b intersects the specified circle.
	 * @param {THREE.Vector2} a
	 * @param {THREE.Vector2} b
	 * @param {THREE.Vector2} center The center of the circle.
	 * @param {number} radius The radius of the circle.
	 */
	export function lineSegmentCircleIntersection(a: THREE.Vector2, b: THREE.Vector2, center: THREE.Vector2, radius: number): boolean
	{
		var attackVector = new THREE.Vector2().set(b.x - a.x, b.y - a.y);
		var segmentLengthSq = attackVector.lengthSq();
		var meToTargetVector = new THREE.Vector2().set(center.x - a.x, center.y - a.y);
		attackVector = attackVector.clone().normalize().multiplyScalar(meToTargetVector.dot(attackVector));
		
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
		return attackVector.lengthSq() <= radius * radius;
	};
}
