
THREE = require("three");

module.exports = ThreeUtils = 
{
	c_planeCorrection: new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(Math.PI, 0, 0)),
	
	textureLoader: new THREE.TextureLoader(),

	// if set, all calls return dummy objects instead of real visual objects
	serverMode: false,
};

THREE.Vector2.ZeroVector = new THREE.Vector2();

THREE.Vector3.ZeroVector = new THREE.Vector3();
THREE.Vector3.ForwardVector = new THREE.Vector3(0, 0, 1);
THREE.Vector3.BackVector = new THREE.Vector3(0, 0, -1);
THREE.Vector3.LeftVector = new THREE.Vector3(-1, 0, 0);
THREE.Vector3.RightVector = new THREE.Vector3(1, 0, 0);
THREE.Vector3.UpVector = new THREE.Vector3(0, -1, 0);
THREE.Vector3.DownVector = new THREE.Vector3(0, 1, 0);

ThreeUtils.makeSpriteMesh = function(tex, geo)
{
	if (this.serverMode)
	{
		return new THREE.Object3D();
	}
	else
	{
		var material = new THREE.MeshBasicMaterial({ map:tex, transparent:true });
		var mesh = new THREE.Mesh(geo, material);
		return mesh;
	}
}

ThreeUtils.makeSpriteGeo = function(width, height)
{
	var geo = new THREE.PlaneGeometry(width, height);
	geo.applyMatrix(ThreeUtils.c_planeCorrection);
	return geo;
}

ThreeUtils.distance = function(thing1, thing2)
{
	var dx = thing1.x - thing2.x;
	var dy = thing1.y - thing2.y;
	return Math.sqrt(dx*dx+dy*dy);
}

// loads the specified texture or returns a cached version
ThreeUtils.loadTexture = function(url)
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
}

ThreeUtils.setTextureNpot = function(texture)
{
	if (texture)
	{
		texture.generateMipmaps = false
		texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
		texture.minFilter = texture.maxFilter = THREE.NearestFilter;
	}
}

ThreeUtils.setTilesheetGeometry = function(geo, x, y, countX, countY, flipX, flipY)
{
	uvs = geo.faceVertexUvs[0];
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
	geo.uvsNeedUpdate = true;
}

// sets an html div to display a single image from an atlas
ThreeUtils.setElementToAtlasImage = function(element, atlas, key)
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
}

ThreeUtils.loadAtlas = function(url,width,height,data,suppressTextureLoad)
{
	var atlas = {url:url,width:width,height:height,data:data};
	if (!suppressTextureLoad)
	{
		atlas.texture = this.textureLoader.load(url);
	}
	this.setTextureNpot(atlas.texture);
	return atlas;
}

ThreeUtils.getAtlasImageWidth = function(atlas,key)
{
	return atlas.data[key][2];
}

ThreeUtils.getAtlasImageHeight = function(atlas,key)
{
	return atlas.data[key][3];
}

//make a sprite mesh for the given texture in the atlas
//pass dynamic if you want to be able to flip the sprite or dynamically switch its texture
ThreeUtils.makeAtlasMesh = function(atlas,key,dynamic)
{
	if (atlas.data[key] === undefined)
	{
		console.error("Atlas '"+atlas.url+"' has no key '"+key+"'.");
		return null;
	}
	if (!atlas.data[key].geo)
	{
		atlas.data[key].geo = this.makeSpriteGeo(atlas.data[key][2],atlas.data[key][3]);
		this.setAtlasUVs(atlas.data[key].geo,atlas,key);
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
}

ThreeUtils.setAtlasUVs = function(geo,atlas,key,flipX,flipY)
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
}

ThreeUtils.setAtlasGeometry = function(geo,atlas,key,flipX,flipY)
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
	this.setAtlasUVs(geo,atlas,key,flipX,flipY);
	
	var w = atlas.data[key][2]/2;
	var h = atlas.data[key][3]/2;
	verts = geo.vertices;
	verts[0].set(-w,-h,0);
	verts[1].set(w,-h,0);
	verts[2].set(-w,h,0);
	verts[3].set(w,h,0);
	geo.verticesNeedUpdate = true;
}

ThreeUtils.setAtlasMeshFlip = function(mesh, flipX, flipY)
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
	this.setAtlasUVs(mesh.geometry,mesh.atlas,mesh.atlas_key);
}

ThreeUtils.setAtlasMeshKey = function(mesh,key)
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
}


ThreeUtils.lineCircleIntersection = function(a, b, center, radius)
{
	var attackVector = new THREE.Vector3().copy(b).sub(a);
	var meToTargetVector = new THREE.Vector3().copy(center).sub(a);
	attackVector.z = meToTargetVector.z = 0;
	attackVector = meToTargetVector.projectOnVector(attackVector);
	attackVector = attackVector.sub(center).add(a);
	attackVector.z = 0;
	return attackVector.lengthSq() <= radius * radius;
}

ThreeUtils.lineSegmentCircleIntersection = function(a, b, center, radius)
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
