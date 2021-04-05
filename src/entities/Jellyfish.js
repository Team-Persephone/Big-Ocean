import "phaser";

export default class Jellyfish extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, spriteKey) {
        super(scene, x, y, spriteKey)

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.anims.play("float", true);
       this.setCollideWorldBounds(true);
			this.body.onWorldBounds = true;
			//makes jellyfish disapear when they get out of the sea
			this.body.world.on('worldbounds', function(body) {
				if (body.gameObject === this) {
					this.destroy();
				}
			  }, this);
    }
}