import Phaser, { Game } from 'phaser';

export default class WaitingRoom extends Phaser.Scene {
  constructor(){
    super('WaitingRoom');
  }

  init(data) {
    this.socket = data.socket;
  }

  preload() {
    this.socket.emit('inWaitingRoom')
  }

  create() {

    console.log('this is this in WaitingRoom', this)

    this.add.text(200, 300, 'Ready to plunge? Click ')
    const start = this.add.text(440, 300, '< Start >');
    start.setInteractive();
    start.on('pointerdown', () => {
      this.scene.launch('Mainscene');
      this.scene.stop('WaitingRoom');
    })
  }

  update() {}
}