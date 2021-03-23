import Phaser from 'phaser';

export default class WaitingRoom extends Phaser.Scene {
  constructor(){
    super('WaitingRoom');
  }

  init(data) {
    this.socket = data.socket;
  }

  preload() {}

  create() {}

  update() {}
}
