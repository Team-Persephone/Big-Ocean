import Phaser from 'phaser';

export default class WaitingRoom extends Phaser.Scene {
  construtor() {
    super('WaitingRoom');
  }

  init(data) {
    this.socket = data.socket;
  }
}

// server: when socket connection is made, (aka, when someone lands on the intro) write a function to create a unique code and emit that code back to the frontend
// client: when the frontend receives the unique code, the unique code is appended to the a href on the "play" button, aka: one.big.ocean.herokuapp.com/8D4F3
// one.big.ocean.herokuapp.com/8D4F3 brings user to the waitingroom
// user can send the unique URL to friends to join the same waiting room.
