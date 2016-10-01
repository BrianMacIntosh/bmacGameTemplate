"use strict";
var THREE = require("three");
var Atlas_1 = require("./Atlas");
var Atlas_2 = require("./Atlas");
exports.Atlas = Atlas_2.Atlas;
var threejsdebugdraw_1 = require("./threejsdebugdraw");
exports.ThreeJsDebugDraw = threejsdebugdraw_1.ThreeJsDebugDraw;
var ThreeUtils;
(function (ThreeUtils) {
    ThreeUtils.c_planeCorrection = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(Math.PI, 0, 0));
    ThreeUtils.textureLoader = new THREE.TextureLoader();
    ThreeUtils.tempVector2 = new THREE.Vector2();
    ThreeUtils.tempVector3 = new THREE.Vector3();
    /**
     * If set, all mesh creation calls return dummy objects instead of real visual objects.
     * @type {boolean}
     */
    ThreeUtils.serverMode = false;
    var textureCache = {};
    var atlasCache = {};
    /**
     * Creates a THREE.Mesh with a unique material.
     * @param {THREE.Texture} texture Texture for the mesh.
     * @param {THREE.Geometry} geometry Geometry for the mesh.
     * @returns {THREE.Object3D}
     */
    function makeSpriteMesh(texture, geometry) {
        if (!(geometry instanceof THREE.Geometry)) {
            console.error("'geometry' is not a THREE.Geometry.");
            console.log(geometry);
            return;
        }
        if (ThreeUtils.serverMode) {
            return new THREE.Object3D();
        }
        else {
            var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
            var mesh = new THREE.Mesh(geometry, material);
            return mesh;
        }
    }
    ThreeUtils.makeSpriteMesh = makeSpriteMesh;
    ;
    /**
     * Creates a plane mesh with the specified dimensions.
     * @param {number} width The width of the plane.
     * @param {number} height The height of the plane.
     * @returns {THREE.Geometry}
     */
    function makeSpriteGeo(width, height) {
        var geo = new THREE.PlaneGeometry(width, height);
        geo.applyMatrix(ThreeUtils.c_planeCorrection);
        return geo;
    }
    ThreeUtils.makeSpriteGeo = makeSpriteGeo;
    ;
    /**
     * Calculates the distance between two THREE.Object3D or THREE.Vector3.
     * @param {THREE.Object3D} thing1
     * @param {THREE.Object3D} thing2
     * @returns {number}
     */
    function distance(thing1, thing2) {
        return Math.sqrt(ThreeUtils.distanceSq(thing1, thing2));
    }
    ThreeUtils.distance = distance;
    ;
    /**
     * Calculates the squared distance between two THREE.Object3D or THREE.Vector3.
     * @param {THREE.Object3D|THREE.Vector3} thing1
     * @param {THREE.Object3D|THREE.Vector3} thing2
     * @returns {number}
     */
    function distanceSq(thing1, thing2) {
        var x1 = thing1.position !== undefined ? thing1.position.x : thing1.x;
        var y1 = thing1.position !== undefined ? thing1.position.y : thing1.y;
        var x2 = thing2.position !== undefined ? thing2.position.x : thing1.x;
        var y2 = thing2.position !== undefined ? thing2.position.y : thing1.y;
        var dx = x1 - x2;
        var dy = y1 - y2;
        return dx * dx + dy * dy;
    }
    ThreeUtils.distanceSq = distanceSq;
    ;
    /**
     * Loads the specified texture. Caches repeated calls.
     * @param {string} url The URL of the texture.
     * @returns {THREE.Texture}
     */
    function loadTexture(url) {
        if (ThreeUtils.serverMode) {
            return undefined;
        }
        if (textureCache[url]) {
            return textureCache[url];
        }
        else {
            textureCache[url] = ThreeUtils.textureLoader.load(url);
            return textureCache[url];
        }
    }
    ThreeUtils.loadTexture = loadTexture;
    ;
    /**
     * Sets the texture as okay to be non-power-of-two.
     * @param {THREE.Texture} texture
     * @returns {THREE.Texture}
     */
    function setTextureNpot(texture) {
        if (texture) {
            texture.generateMipmaps = false;
            texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.minFilter = texture.magFilter = THREE.NearestFilter;
        }
        return texture;
    }
    ThreeUtils.setTextureNpot = setTextureNpot;
    ;
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
    function setTilesheetGeometry(geometry, x, y, countX, countY, flipX, flipY) {
        var uvs = geometry.faceVertexUvs[0];
        var l = x / countX;
        var b = 1 - y / countY;
        var r = (x + 1) / countX;
        var t = 1 - (y + 1) / countY;
        if (flipX) {
            var temp = l;
            l = r;
            r = temp;
        }
        if (flipY) {
            var temp = t;
            t = b;
            b = temp;
        }
        uvs[0][0].set(l, b);
        uvs[0][1].set(l, t);
        uvs[0][2].set(r, b);
        uvs[1][0].set(l, t);
        uvs[1][1].set(r, t);
        uvs[1][2].set(r, b);
        geometry.uvsNeedUpdate = true;
        return geometry;
    }
    ThreeUtils.setTilesheetGeometry = setTilesheetGeometry;
    ;
    /**
     * Loads the atlas represented by the specified key or returns a cached version.
     * @param key {string}
     * @returns {Atlas}
     */
    function loadAtlas(key) {
        var allData = require("../../../data/atlases.json");
        var atlasData = allData[key];
        if (atlasData) {
            if (!atlasCache[atlasData.url]) {
                atlasCache[atlasData.url] = new Atlas_1.Atlas(atlasData);
            }
            return atlasCache[atlasData.url];
        }
        else {
            console.error("Tried to load unknown atlas '" + key + "'.");
            return null;
        }
    }
    ThreeUtils.loadAtlas = loadAtlas;
    ;
    /**
     * Sets an HTML div to display an image in an atlas.
     * @param {HTMLElement} element The element to configure.
     * @param {Atlas} atlas The atlas to us.
     * @param {string} key The key to use from the atlas.
     * @returns {HTMLElement}
     */
    function setElementToAtlasImage(element, atlas, key) {
        // set icon using background position
        var atlasCoords = atlas.sprites[key];
        if (atlasCoords === undefined) {
            atlasCoords = atlas.sprites["missing"];
        }
        if (atlasCoords !== undefined) {
            element.style["background-image"] = "url(\"" + atlas.url + "\")";
            element.style["background-position"] = (-atlasCoords[0]) + "px " + (-atlasCoords[1]) + "px";
            element.style["width"] = atlasCoords[2] + "px";
            element.style["height"] = atlasCoords[3] + "px";
        }
        return element;
    }
    ThreeUtils.setElementToAtlasImage = setElementToAtlasImage;
    ;
    /**
     * Creates a mesh for the given sprite in the atlas.
     * @param {ThreeUtils.Atlas} atlas
     * @param {string} key
     * @param {boolean} dynamic Set if you want to be able to flip the sprite or dynamically switch its texture.
     */
    function makeAtlasMesh(atlas, key, dynamic) {
        if (atlas.sprites[key] === undefined) {
            console.error("Atlas '" + atlas.url + "' has no key '" + key + "'.");
            return null;
        }
        if (!atlas.sprites[key].geo) {
            atlas.sprites[key].geo = makeSpriteGeo(atlas.sprites[key][2], atlas.sprites[key][3]);
            _setAtlasUVs(atlas.sprites[key].geo, atlas, key);
        }
        var geo = atlas.sprites[key].geo;
        if (dynamic) {
            geo = geo.clone();
            geo.dynamic = true;
            geo.atlas_flipx = false;
            geo.atlas_flipy = false;
        }
        var mesh = ThreeUtils.makeSpriteMesh(atlas.texture, geo);
        mesh.atlas = atlas;
        mesh.atlas_key = key;
        return mesh;
    }
    ThreeUtils.makeAtlasMesh = makeAtlasMesh;
    ;
    function _setAtlasUVs(geometry, atlas, key, flipX, flipY) {
        if (!atlas) {
            console.error("Geometry is not atlased.");
            return;
        }
        if (atlas.sprites[key] === undefined) {
            console.error("Atlas '" + atlas.url + "' has not key '" + key + "'");
            return;
        }
        var uvs = geometry.faceVertexUvs[0];
        var l = atlas.sprites[key][0] / atlas.width;
        var b = (1 - atlas.sprites[key][1] / atlas.height);
        var r = l + atlas.sprites[key][2] / atlas.width;
        var t = b - atlas.sprites[key][3] / atlas.height;
        if (geometry.atlas_flipx) {
            var temp = l;
            l = r;
            r = temp;
        }
        if (geometry.atlas_flipy) {
            var temp = t;
            t = b;
            b = temp;
        }
        uvs[0][0].set(l, b);
        uvs[0][1].set(l, t);
        uvs[0][2].set(r, b);
        uvs[1][0].set(l, t);
        uvs[1][1].set(r, t);
        uvs[1][2].set(r, b);
        geometry.uvsNeedUpdate = true;
        return geometry;
    }
    ;
    /**
     * Sets the UVs of the specified geometry to display the specified atlas sprite.
     * @param {THREE.Geometry} geometry
     * @param {ThreeUtils.Atlas} atlas
     * @param {string} key
     * @param {boolean} flipX
     * @param {boolean} flipY
     */
    function setAtlasGeometry(geometry, atlas, key, flipX, flipY) {
        if (!atlas) {
            console.error("Geometry is not atlased.");
            return;
        }
        if (atlas.sprites[key] === undefined) {
            console.error("Atlas '" + atlas.url + "' has not key '" + key + "'");
            return;
        }
        _setAtlasUVs(geometry, atlas, key, flipX, flipY);
        var w = atlas.sprites[key][2] / 2;
        var h = atlas.sprites[key][3] / 2;
        var verts = geometry.vertices;
        verts[0].set(-w, -h, 0);
        verts[1].set(w, -h, 0);
        verts[2].set(-w, h, 0);
        verts[3].set(w, h, 0);
        geometry.verticesNeedUpdate = true;
        return geometry;
    }
    ThreeUtils.setAtlasGeometry = setAtlasGeometry;
    ;
    /**
     * Sets the flipped state of the specified atlas mesh.
     * @param {THREE.Mesh} mesh
     * @param {boolean} flipX
     * @param {boolean} flipY
     */
    function setAtlasMeshFlip(mesh, flipX, flipY) {
        if (!mesh.geometry) {
            return;
        }
        if (!mesh.geometry.dynamic) {
            console.error("Geometry is not dynamic.");
            return;
        }
        if (flipX == mesh.geometry.atlas_flipx && flipY == mesh.geometry.atlas_flipy)
            return;
        mesh.geometry.atlas_flipx = flipX;
        mesh.geometry.atlas_flipy = flipY;
        _setAtlasUVs(mesh.geometry, mesh.atlas, mesh.atlas_key);
        return mesh;
    }
    ThreeUtils.setAtlasMeshFlip = setAtlasMeshFlip;
    ;
    /**
     * Sets the UVs of the specified atlas mesh to the specified sprite key.
     * @param {THREE.Mesh} mesh
     * @param {string} key
     */
    function setAtlasMeshKey(mesh, key) {
        if (!mesh.geometry) {
            return;
        }
        if (!mesh.geometry.dynamic) {
            console.error("Geometry is not dynamic.");
            return;
        }
        if (key === mesh.atlas_key)
            return;
        mesh.atlas_key = key;
        setAtlasGeometry(mesh.geometry, mesh.atlas, mesh.atlas_key);
        return mesh;
    }
    ThreeUtils.setAtlasMeshKey = setAtlasMeshKey;
    ;
    /**
     * Returns true if the line passing through a and b intersects the specified circle.
     * @param {THREE.Vector2} a
     * @param {THREE.Vector2} b
     * @param {THREE.Vector2} center The center of the circle.
     * @param {number} radius The radius of the circle.
     */
    function lineCircleIntersection(a, b, center, radius) {
        var attackVector = new THREE.Vector2().set(b.x - a.x, b.y - a.y);
        var meToTargetVector = new THREE.Vector2().set(center.x - a.x, center.y - a.y);
        attackVector = attackVector.clone().normalize().multiplyScalar(meToTargetVector.dot(attackVector));
        attackVector = attackVector.sub(center).add(a);
        return attackVector.lengthSq() <= radius * radius;
    }
    ThreeUtils.lineCircleIntersection = lineCircleIntersection;
    ;
    /**
     * Returns true if the line segment from a to b intersects the specified circle.
     * @param {THREE.Vector2} a
     * @param {THREE.Vector2} b
     * @param {THREE.Vector2} center The center of the circle.
     * @param {number} radius The radius of the circle.
     */
    function lineSegmentCircleIntersection(a, b, center, radius) {
        var attackVector = new THREE.Vector2().set(b.x - a.x, b.y - a.y);
        var segmentLengthSq = attackVector.lengthSq();
        var meToTargetVector = new THREE.Vector2().set(center.x - a.x, center.y - a.y);
        attackVector = attackVector.clone().normalize().multiplyScalar(meToTargetVector.dot(attackVector));
        var d = meToTargetVector.dot(attackVector);
        // circle is behind the segment
        if (d < 0)
            return false;
        attackVector.normalize().multiplyScalar(d);
        // check that the segment range is correct
        var projectionLengthSq = attackVector.lengthSq();
        if (projectionLengthSq > segmentLengthSq) {
            return false;
        }
        // check that the line is within the circle
        attackVector = attackVector.sub(center).add(a);
        return attackVector.lengthSq() <= radius * radius;
    }
    ThreeUtils.lineSegmentCircleIntersection = lineSegmentCircleIntersection;
    ;
})(ThreeUtils = exports.ThreeUtils || (exports.ThreeUtils = {}));
