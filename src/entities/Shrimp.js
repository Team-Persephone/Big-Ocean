import "phaser";

export default class Shrimp extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, spriteKey) {
		super(scene, x, y, spriteKey);

		this.scene = scene;
		this.scene.add.existing(this);
		this.scene.physics.world.enable(this);
		this.anims.play("shrimpmove", true);
	}
}