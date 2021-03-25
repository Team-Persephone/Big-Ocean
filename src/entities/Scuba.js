import "phaser";

export default class Scuba extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, spriteKey) {
		super(scene, x, y, spriteKey);

		this.faceRight = true;
		this.scene = scene;
		this.scene.add.existing(this);
		this.scene.physics.world.enable(this);
		this.waiting = true;
	}

	setWaiting(wait){
		this.waiting = wait;
	}

	updateMovement(cursors) {
		//move down
		const waiting = this.waiting;

		if (!waiting && cursors.down.isDown) {
			if (this.faceRight) {
				this.setAngle(45);
			} else if (!this.faceRight) {
				this.setAngle(-45);
			}
			this.anims.play("swim", true);
			this.setVelocityY(50);
			this.scene.socket.emit("playerMovement", {
				key: this.scene.state.key,
				x: this.scene.scubaDiver.x,
				y: this.scene.scubaDiver.y,
				angle: this.scene.scubaDiver.angle,
				faceRight: this.faceRight
			});
		}
		//move up
		else if (!waiting && cursors.up.isDown) {
			if (this.faceRight) {
				this.setAngle(-45);
			} else if (!this.faceRight) {
				this.setAngle(45);
			}
			this.anims.play("swim", true);
			this.setVelocityY(-50);
			this.scene.socket.emit("playerMovement", {
				key: this.scene.state.key,
				x: this.scene.scubaDiver.x,
				y: this.scene.scubaDiver.y,
				angle: this.scene.scubaDiver.angle,
				faceRight: this.faceRight
			});
		}
		//move left
		else if (cursors.left.isDown) {
			if (this.faceRight) {
				this.flipX = !this.flipX;
				this.faceRight = false;
			}
			this.anims.play("swim", true);
			this.setVelocityX(-50);
			this.scene.socket.emit("playerMovement", {
				key: this.scene.state.key,
				x: this.scene.scubaDiver.x,
				y: this.scene.scubaDiver.y,
				angle: this.scene.scubaDiver.angle,
				faceRight: this.faceRight
			});
		}
		//move right
		else if (cursors.right.isDown) {
			if (!this.faceRight) {
				this.flipX = !this.flipX;
				this.faceRight = true;
			 }
			this.anims.play("swim", true);
			this.setVelocityX(50);
			this.scene.socket.emit("playerMovement", {
				key: this.scene.state.key,
				x: this.scene.scubaDiver.x,
				y: this.scene.scubaDiver.y,
				angle: this.scene.scubaDiver.angle,
				faceRight: this.faceRight
			});
		} else {
			this.setVelocityX(0);
			this.setVelocityY(0);
			this.scene.socket.emit("playerMovement", {
				key: this.scene.state.key,
				x: this.scene.scubaDiver.x,
				y: this.scene.scubaDiver.y,
				angle: this.scene.scubaDiver.angle,
				faceRight: this.faceRight
			});
			this.angle = 0;
		}
	}

	update(cursors) {
		this.updateMovement(cursors);
	}
}
