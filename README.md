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

## sdk/engine
Create an instance of bmacSdk.GameEngine to run the game. The engine will automatically
manage rendering and updating.

The game is made of objects added to the engine. Add objects with engine.addObject(object).
Added objects will automatically have the 'added' function called, if it exists. Also,
'update' will automatically be called every frame, if it exists.

## three.js
The SDK uses three.js (http://threejs.org/docs/) for rendering.

The engine provides a scene (property 'scene'), and a camera (property 'camera') and manages
rendering for you.

### sdk/threeutils
Provides utilities for creating three.js meshes, including sprite atlasing and spritesheets.

## sdk/atlases
Holds data on sprites contained in atlas images. The atlases are built by 'tools/build_atlases.bat'.
Each folder in 'atlas-raw' is built into one atlas. The data can be loaded into an atlas with
'sdk/threeutils'.

## sdk/audiomanager
Utility for playing sound effects. Pretty bare-bones currently.

## box2d
The SDK uses Box2D (http://box2d.org/manual.pdf) for physics and collision.

At the moment, you have to initialize and manage the Box2D world.

### sdk/b2utils
Provides utilities for creating Box2D bodies.

b2Utils.PhysicsLinkedObject is a base class for game objects that have a Box2D body and a three.js
visual component. It automatically synchronizes the visuals with the body. It also recieves collision
callbacks from Box2D.

## sdk/input
Subscribes to input events and provides methods for easily querying input from the keyboard,
mouse, and gamepads.

This is automatically intialized by the engine.

## sdk/polyfill
This file sets up a number of polyfills for math and other simple logic.

This is automatically intialized by the engine.
