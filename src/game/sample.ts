
import { EngineObject } from "../bmacSdk/engine";
import { ThreeUtils } from "../bmacSdk/threeutils";
import { Input, Keyboard, Mouse, Gamepad } from "../bmacSdk/input";

export class SampleGame extends EngineObject
{
	private mesh: THREE.Mesh;
	private dirtTexture: THREE.Texture;
	private dirtGeo: THREE.Geometry;

	// 'added' is called by the engine when this object is added
	public added()
	{
		this.dirtTexture = ThreeUtils.loadTexture("media/dirt.png");
		this.dirtGeo = ThreeUtils.makeSpriteGeo(128, 64);
		
		this.mesh = ThreeUtils.makeSpriteMesh(this.dirtTexture, this.dirtGeo);
		this.mesh.position.set(200, 200, -10);

		this.owner.scene.add(this.mesh);
	};

	// 'removed' is called by the engine when this object is removed
	public removed()
	{
		
	};

	// 'update' is called by the engine once per frame
	public update(deltaSec: number)
	{
		// move the mesh 50 pixels per second based on input
		if (Keyboard.keyDown('a') || Keyboard.keyDown(Keyboard.Key.Left))
		{
			this.mesh.position.x -= 50 * deltaSec;
		}
		if (Keyboard.keyDown('d') || Keyboard.keyDown(Keyboard.Key.Right))
		{
			this.mesh.position.x += 50 * deltaSec;
		}

		super.update(deltaSec);
	};
}