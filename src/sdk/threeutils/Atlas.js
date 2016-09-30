"use strict";
var _1 = require("./");
var Atlas = (function () {
    /**
     * Creates a new atlas.
     * @class
     * @param {string} url The url of the atlas image.
     * @param {number} width The pixel width of the image. //TODO: don't require this
     * @param {number} height The pixel height of the image. //TODO: don't require this
     * @param {Object} sprites The atlas key data.
     * @param {boolean} suppressTextureLoad If set, does not automatically load the texture.
     */
    function Atlas(data, suppressTextureLoad) {
        this.url = data.url;
        this.width = data.width;
        this.height = data.height;
        this.sprites = data.sprites;
        if (!suppressTextureLoad) {
            this.texture = _1.ThreeUtils.loadTexture(this.url);
            this.texture.minFilter = this.texture.magFilter = data.filter;
            _1.ThreeUtils.setTextureNpot(this.texture);
        }
    }
    /**
     * Returns the width of the given sprite in the atlas.
     * @param {string} key The sprite key.
     * @returns {number}
     */
    Atlas.prototype.getSpriteWidth = function (key) {
        return this.sprites[key][2];
    };
    /**
     * Returns the height of the given sprite in the atlas.
     * @param {string} key The sprite key.
     * @returns {number}
     */
    Atlas.prototype.getSpriteHeight = function (key) {
        return this.sprites[key][3];
    };
    return Atlas;
}());
exports.Atlas = Atlas;
