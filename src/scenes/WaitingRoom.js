import Phaser from 'phaser';

export default class WaitingRoom extends Phaser.Scene {
  constructor() {
    super('WaitingRoom');
  }

  init(data) {
    this.socket = data.socket;
  }

  preload() {
    this.load.image('tiles', '/assets/ocean-tilesheet.png');
    this.load.tilemapTiledJSON('tilemap', '/assets/big-ocean-level1.json');
  }

  create() {
    //if there is a gameKey in the url, stop the waiting room because the code was already generated
    if (window.location.pathname.length > 1) {
      //gets gameKey from url
      const gameKey = window.location.pathname.slice(1);

      this.socket.emit('joinGame', gameKey);

      this.scene.stop('WaitingRoom');
      return;
    }

    const createGameButton = this.add.text(600, 500, 'Create new game', {
      fontFamily: 'menlo',
    });
    createGameButton.setInteractive();
    createGameButton.on('pointerdown', () => {
      createGameButton.setVisible(false);
      this.socket.emit('createNewGame');
      this.scene.stop('WaitingRoom');
    });
  }

  update() {}
}

// server: when socket connection is made, (aka, when someone lands on the intro) write a function to create a unique code and emit that code back to the frontend
// client: when the frontend receives the unique code, the unique code is appended to the a href on the "play" button, aka: one.big.ocean.herokuapp.com/8D4F3
// one.big.ocean.herokuapp.com/8D4F3 brings user to the waitingroom
// user can send the unique URL to friends to join the same waiting room.
