import Phaser from 'phaser';

export default class WaitingRoom extends Phaser.Scene {
  constructor() {
    super('WaitingRoom');
  }

  init(data) {
    this.socket = data.socket;
  }

  preload() {
    // this.load.html("createGame", "assets/text/createGameButton.html");
    this.load.image('tiles', '/assets/ocean-tilesheet.png');
    this.load.tilemapTiledJSON('tilemap', '/assets/big-ocean-level1.json');
  }

  create() {
    const createGameButton = this.add.text(600, 500, 'Create new game', {
      fontFamily: 'menlo',
    });
    createGameButton.setInteractive();
    createGameButton.on('pointerdown', () => {
      createGameButton.setVisible(false);
      this.socket.emit('createNewGame');
      this.socket.on('gameCreated', function (key) {
        window.location.replace(`/${key}`).preventDefault();
        // this.scene.stop('WaitingRoom');
      });
    });
  }

  update() {}
}

// server: when socket connection is made, (aka, when someone lands on the intro) write a function to create a unique code and emit that code back to the frontend
// client: when the frontend receives the unique code, the unique code is appended to the a href on the "play" button, aka: one.big.ocean.herokuapp.com/8D4F3
// one.big.ocean.herokuapp.com/8D4F3 brings user to the waitingroom
// user can send the unique URL to friends to join the same waiting room.
