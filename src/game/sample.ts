
import { EngineObject } from "../bmacSdk/engine";
import { THREE, ThreeUtils } from "../bmacSdk/threeutils";
import { Input, Keyboard, Mouse, Gamepad } from "../bmacSdk/input";

export class SampleGame extends EngineObject
{
	private mesh3: THREE.Mesh;
	private mesh4: THREE.Mesh;

	c_planeCorrection: THREE.Matrix4 = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(Math.PI, 0, 0));

	// 'added' is called by the engine when this object is added
	public added()
	{
		/*this.mesh = ThreeUtils.makeAtlasMesh(ThreeUtils.loadAtlas("general"), "a", true);
		this.mesh.position.set(200, 200, -10);
		this.owner.scene.add(this.mesh);

		this.mesh2 = ThreeUtils.makeAtlasMesh(ThreeUtils.loadAtlas("general"), "b", true);
		this.mesh2.position.set(200, 0, -10);
		this.owner.scene.add(this.mesh2);*/

		var loader = new THREE.TextureLoader();

		var geometry3 = new THREE.PlaneGeometry(64, 128);
		geometry3.applyMatrix(this.c_planeCorrection);
		this.mesh3 = new THREE.Mesh(geometry3, new THREE.MeshBasicMaterial({map:loader.load("atlas-raw/general/a.png")}));
		this.mesh3.position.set(0, 0, -10);
		this.owner.scene.add(this.mesh3);

		var geometry4 = new THREE.PlaneGeometry(256, 128);
		geometry4.applyMatrix(this.c_planeCorrection);
		this.mesh4 = new THREE.Mesh(geometry4, new THREE.MeshBasicMaterial({map:loader.load("atlas-raw/general/b.png")}));
		this.mesh4.position.set(0, 200, -10);
		this.owner.scene.add(this.mesh4);
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
			this.mesh4.position.x -= 50 * deltaSec;
		}
		if (Keyboard.keyDown('d') || Keyboard.keyDown(Keyboard.Key.Right))
		{
			this.mesh4.position.x += 50 * deltaSec;
		}

		super.update(deltaSec);
	};
}