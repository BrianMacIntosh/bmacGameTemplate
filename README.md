# bmacSdk
A Javascript game engine built around Three.JS for the Ludum Dare game jam.

# First-Time Setup
1. Install node.js (https://nodejs.org/en/download/).
2. Run 'first-time-setup.bat'

# Testing
1. Run 'build.bat' or 'build_release.bat'
2. Open 'index.html' in a browser.
  * Chrome must be started with the '--allow-file-access-from-files' parameter.

# Documentation

## three.js
The SDK uses three.js (http://threejs.org/docs/) for rendering.

The module 'src/sdk/threeutils' has helpful methods for interacting with three.js.

**ThreeUtils.makeSpriteMesh(texture, geometry)**: creates a THREE.Mesh

**ThreeUtils.makeSpriteGeo(width, height)**: creates a plane geometry of the specified dimensions

**ThreeUtils.loadTexture(url)**: loads a texture

**ThreeUtils.setTilesheetGeometry(geometry, x, y, countX, countY, flipX, flipY)**: sets the UVs of the specified geometry to display the specified tile
* x: The x (u) coordinate of the tile to use.
* y: The y (v) coordinate of the tile to use.

## box2d