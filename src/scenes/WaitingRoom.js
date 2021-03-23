import Phaser from 'phaser';


function addMessageElement(el) {
  messages.append(el);
  messages.lastChild.scrollIntoView();
}

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