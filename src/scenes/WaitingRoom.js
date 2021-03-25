import Phaser from 'phaser';

export default class WaitingRoom extends Phaser.Scene {
  constructor(){
    super('WaitingRoom');
  }

  init(data) {
    this.socket = data.socket;
  }

  preload() {}

  create() {

    this.add.text(150, 200, 'When you are ready to plunge, click ')
    const start = this.add.text(500, 200, '< Start >');
    start.setInteractive();
    start.on('pointerdown', () => {
      this.scene.launch('Mainscene');
      this.scene.stop('WaitingRoom');
    })
  }

  update() {}
}
