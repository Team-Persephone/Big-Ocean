import Phaser from 'phaser';

export default class WaitingRoom extends Phaser.Scene {
  constructor() {
    super('WaitingRoom');
  }
  //get scoket data as props from MainRoom
  init(data) {
    this.socket = data.socket;
  }

   // THIS IS PHASER PRELOAD FUCNTION TO LOAD ALL FILES NEEDED TO CREATE SCENE
  preload() {
    console.log('this is this in preload', this)
    this.load.image('tiles', '/assets/ocean-tilesheet.png');
    this.load.tilemapTiledJSON('tilemap', '/assets/big-ocean-level1.json');
  }

  // THIS IS PHASER CREATE FUNCTION TO CREATE SCENE 
  create() {
    const scene = this
    let key;
    
    //add gamekey to url for host to share
    function addUrl (gameKey) {
      const url = `http://localhost:3000/${gameKey}`;
      const link = scene.add.text(100, 100, url);
      link.setInteractive();
      link.on('pointerdown', () => {
        navigator.clipboard.writeText(url);
        link.setText('copied!');
        // let s = window.open(url, '_blank')
        // if(s && s.focus) s.focus()
        // else if (!s) window.location.href = url
      });
    };
    //if there is a gameKey in the url, stop the waiting room because the code was already generated
    if (window.location.pathname.length > 1) {
      //gets gameKey from url
      const gameKey = window.location.pathname.slice(1);
      this.socket.emit('joinGame', gameKey);
      this.scene.stop('WaitingRoom');
      // return;
    }
    //OTHERWISE THIS:
    // add button to creat game to scene
    const createGameButton = this.add.text(600, 500, 'Create new game', { fontFamily: 'menlo' });
    createGameButton.setInteractive();
    createGameButton.on('pointerdown', () => {
      createGameButton.setVisible(false);
      joinGameButton.setVisible(true)
      this.socket.emit('createGame')
    });
    
    this.socket.on('gameCreated', gameKey => {
      key = gameKey
      addUrl(gameKey)
    })

      const joinGameButton = this.add.text( 600, 500, 'join Game', { fontFamily: 'menlo' });
      joinGameButton.setVisible(false)
      joinGameButton.setInteractive();
      joinGameButton.on('pointerdown', () => {
        joinGameButton.setVisible(false);
        this.socket.emit('joinGame', key)
        this.scene.stop('WaitingRoom');   
      });
        
}
  
  update() {


  }
}

// server: when socket connection is made, (aka, when someone lands on the intro) write a function to create a unique code and emit that code back to the frontend
// client: when the frontend receives the unique code, the unique code is appended to the a href on the "play" button, aka: one.big.ocean.herokuapp.com/8D4F3
// one.big.ocean.herokuapp.com/8D4F3 brings user to the waitingroom
// user can send the unique URL to friends to join the same waiting room.
