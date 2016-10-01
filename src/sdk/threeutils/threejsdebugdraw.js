"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE = require("three");
var b2utils_1 = require("../b2utils");
var box2d_1 = require("../../thirdparty/box2d");
/**
 * An object that manages drawing debug shapes for bodies in a Box2D world.
 * @namespace
 */
var ThreeJsDebugDraw = (function (_super) {
    __extends(ThreeJsDebugDraw, _super);
    function ThreeJsDebugDraw() {
        _super.apply(this, arguments);
        // nested array, indexed by vert count
        this.meshPools = {};
        this.poolIndices = {};
        this.transform = new THREE.Object3D();
    }
    ThreeJsDebugDraw.prototype.getGeometry = function (color, vertCount) {
        if (!this.meshPools[vertCount]) {
            this.meshPools[vertCount] = [];
            this.poolIndices[vertCount] = 0;
        }
        var pool = this.meshPools[vertCount];
        var mesh;
        var geometry;
        var index = this.poolIndices[vertCount]++;
        if (!pool[index]) {
            geometry = new THREE.Geometry();
            for (var i = 0; i < vertCount; i++) {
                geometry.vertices.push(new THREE.Vector3());
            }
            var lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
            mesh = new THREE.Line(geometry, lineMaterial);
            pool[index] = mesh;
            this.transform.add(mesh);
        }
        else {
            mesh = pool[index];
            var material = pool[index].material;
            material.color.setRGB(color.r, color.g, color.b);
            geometry = pool[index].geometry;
        }
        mesh.visible = true;
        return geometry;
    };
    ;
    ThreeJsDebugDraw.prototype.startDrawing = function () {
        // reset mesh counters
        for (var i in this.meshPools) {
            this.poolIndices[i] = 0;
        }
    };
    ;
    ThreeJsDebugDraw.prototype.finishDrawing = function () {
        // hide excess meshPools
        for (var i in this.meshPools) {
            for (; this.poolIndices[i] < this.meshPools[i].length; this.poolIndices[i]++) {
                this.meshPools[i][this.poolIndices[i]].visible = false;
            }
        }
    };
    ;
    ThreeJsDebugDraw.prototype.DrawSegment = function (vert1, vert2, color) {
        var geometry = this.getGeometry(color, 2);
        var x1 = vert1.x * b2utils_1.b2Utils.B2_SCALE;
        var y1 = vert1.y * b2utils_1.b2Utils.B2_SCALE;
        var x2 = vert2.x * b2utils_1.b2Utils.B2_SCALE;
        var y2 = vert2.y * b2utils_1.b2Utils.B2_SCALE;
        geometry.vertices[0].set(x1, y1, 0);
        geometry.vertices[1].set(x2, y2, 0);
        geometry.verticesNeedUpdate = true;
        geometry.computeBoundingSphere();
    };
    ;
    ThreeJsDebugDraw.prototype.DrawPolygon = function (vertices, vertexCount, color) {
        var geometry = this.getGeometry(color, vertexCount + 1);
        for (var i = 0; i < vertexCount; i++) {
            var x = vertices[i].x * b2utils_1.b2Utils.B2_SCALE;
            var y = vertices[i].y * b2utils_1.b2Utils.B2_SCALE;
            geometry.vertices[i].set(x, y, 0);
        }
        // close by drawing the first vert again
        var x = vertices[i].x * b2utils_1.b2Utils.B2_SCALE;
        var y = vertices[i].y * b2utils_1.b2Utils.B2_SCALE;
        geometry.vertices[i].set(x, y, 0);
        geometry.verticesNeedUpdate = true;
        geometry.computeBoundingSphere();
    };
    ;
    ThreeJsDebugDraw.prototype.DrawSolidPolygon = function (vertices, vertexCount, color) {
        //TODO:
        this.DrawPolygon(vertices, vertexCount, color);
    };
    ;
    ThreeJsDebugDraw.prototype.DrawCircle = function (center, radius, color) {
        var circleRes = 16;
        var geometry = this.getGeometry(color, circleRes + 1);
        var cx = center.x * b2utils_1.b2Utils.B2_SCALE;
        var cy = center.y * b2utils_1.b2Utils.B2_SCALE;
        for (var i = 0; i < circleRes; i++) {
            var angle = i * Math.PI * 2 / circleRes;
            var x = Math.cos(angle) * radius * b2utils_1.b2Utils.B2_SCALE + cx;
            var y = Math.sin(angle) * radius * b2utils_1.b2Utils.B2_SCALE + cy;
            geometry.vertices[i].set(x, y, 0);
        }
        // close by drawing the first vert again
        var x = Math.cos(0) * radius * b2utils_1.b2Utils.B2_SCALE + cx;
        var y = Math.sin(0) * radius * b2utils_1.b2Utils.B2_SCALE + cy;
        geometry.vertices[i].set(x, y, 0);
        geometry.verticesNeedUpdate = true;
        geometry.computeBoundingSphere();
    };
    ;
    ThreeJsDebugDraw.prototype.DrawSolidCircle = function (center, radius, axis, color) {
        //TODO:
        this.DrawCircle(center, radius, color);
    };
    ;
    ThreeJsDebugDraw.prototype.DrawTransform = function (transform) {
        //TODO:
    };
    ;
    return ThreeJsDebugDraw;
}(box2d_1.Box2D.b2DebugDraw));
exports.ThreeJsDebugDraw = ThreeJsDebugDraw;
