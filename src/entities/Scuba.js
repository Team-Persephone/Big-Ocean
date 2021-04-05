import "phaser";

export default class Scuba extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, spriteKey) {
		super(scene, x, y, spriteKey);

		this.faceRight = true;
		this.scene = scene;
		this.scene.add.existing(this);
		this.scene.physics.world.enable(this);
		this.waiting = true;
		this.frozen = false;
	}

	tweenPosition(x, y) {
		this.scene.tweens.add({
			targets: this,
			x,
			y,
			ease: "Linear", // 'Cubic', 'Elastic', 'Bounce', 'Back'
			duration: 1000,
			repeat: 0, // -1: infinity
			yoyo: false
		});
	}

	updateScore(score){
		if(score )
			score.setText(`${this.avatar}: ${this.score}`)
	}
	

	updateMovement(cursors) {
		
		// this.anims.play("swim", true);

		let movementObject = {
			key: this.scene.state.key,
			x: this.scene.scubaDiver.x,
			y: this.scene.scubaDiver.y,
			angle: this.scene.scubaDiver.angle,
			faceRight: this.faceRight,
			playerId: this.scene.scubaDiver.playerId
		};

		//move down
		const waiting = this.waiting;
		const frozen = this.frozen;
		if (!waiting && !frozen && cursors.down.isDown) {
			if(this.hit){
				this.anims.play("scubaHit", true)
			}
			if (this.faceRight) {
				this.setAngle(45);
			} else if (!this.faceRight) {
				this.setAngle(-45);
			}
			this.setVelocityY(100);
			this.scene.socket.emit("playerMovement", movementObject);
		}
		//move up
		else if (!waiting && !frozen && cursors.up.isDown) {
			if (this.faceRight) {
				this.setAngle(-45);
			} else if (!this.faceRight) {
				this.setAngle(45);
			}
			this.setVelocityY(-100);
			this.scene.socket.emit("playerMovement", movementObject);
		}
		//move left
		else if (!frozen && cursors.left.isDown) {
			if (this.faceRight) {
				this.flipX = !this.flipX;
				this.faceRight = false;
			}
			this.setVelocityX(-100);
			this.scene.socket.emit("playerMovement", movementObject);
		}
		//move right
		else if (!frozen && cursors.right.isDown) {
			if (!this.faceRight) {
				this.flipX = !this.flipX;
				this.faceRight = true;
			}
			this.setVelocityX(100);
			this.scene.socket.emit("playerMovement", movementObject);
		}
		//no movement
		else {
			this.setVelocityX(0);
			this.setVelocityY(0);
			this.scene.socket.emit("playerMovement", movementObject);
			this.angle = 0;
		}
	}

	update(cursors) {
		this.updateMovement(cursors);
	}
}
