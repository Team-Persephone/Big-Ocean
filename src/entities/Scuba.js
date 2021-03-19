import 'phaser'

export default class Scuba extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, spriteKey) {
       super(scene, x, y, spriteKey);

        this.facingUp = true
        this.faceRight = true

       this.scene = scene;
       this.scene.add.existing(this);
       this.scene.physics.world.enable(this);
   }
   updateMovement(cursors) {
    //move down
    if(cursors.down.isDown) {
        if(this.facingUp && this.faceRight){
                this.setAngle(45)
                this.facingUp = false;
        }
        else if(this.facingUp && !this.faceRight){
                this.setAngle(-45)
                this.facingUp = false;
            }
        this.anims.play('swimm', true)
        this.setVelocityY(50);
    }
    //move up
    else if(cursors.up.isDown) {
        if(!this.facingUp && this.faceRight){
                this.setAngle(-45)
                this.facingUp = true;
            }
        else if(!this.faceUp && !this.faceRight){
                this.setAngle(45)
                this.facingUp = true;
            }
        this.anims.play('swimm', true)
        this.setVelocityY(-50);
    }
    //move left
    else if(cursors.left.isDown) {
        
        if(this.faceRight){
            this.flipX = !this.flipX;
            this.faceRight = false;
        }
        this.anims.play('swimm', true)
        this.setVelocityX(-50);
    }
    //move right
    else if(cursors.right.isDown) {
        if(!this.faceRight){
            this.flipX = !this.flipX;
            this.faceRight = true;
        }
        this.anims.play('swimm', true)
        this.setVelocityX(50);
    }
    else {
        this.setVelocityX(0);
        this.setVelocityY(0);
        this.angle = 0
    }
   }

   update(cursors) {
       this.updateMovement(cursors);
   }
}