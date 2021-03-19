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
        if(this.facingUp){
            this.setAngle(45)
            this.facingUp = false;
        }
        this.setVelocityY(300);
    }
    //move up
    else if(cursors.up.isDown) {
        if(!this.facingUp){
            this.setAngle(-45)
            this.facingUp = true;
        }
        this.setVelocityY(-300);
    }
    //move left
    else if(cursors.left.isDown) {
        if(!this.faceRight){
            this.flipY = !this.flipY;
            this.faceRight = true;
        }

        this.setVelocityX(-300);
    }
    //move right
    else if(cursors.right.isDown) {
        if(this.faceRight){
            this.flipY = !this.flipY;
            this.faceRight = false;
        }

        this.setVelocityX(300);
    }
    else {
        this.setVelocityY(0);
        this.setVelocityX(0);
    }
   }

   update(cursors) {
       this.updateMovement(cursors);
   }
}