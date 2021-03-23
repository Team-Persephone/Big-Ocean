import phaser from 'phaser';

import Scuba from '../entities/Scuba';

const memoInput = document.getElementById("chat-input");
const submitMemoBtn = document.getElementById("submit-memo-btn");
const chatContainer = document.getElementById("playerChatId")

const NUM_MESSAGES = 10;
// const inputMessage = document.getElementById('inputMessage');
// const messages = document.getElementById('messages');

// window.addEventListener('keydown', event => {
//   if (event.which === 13) {
//    sendMessage();
//   }
//   if (event.which === 32) {
//     if (document.activeElement === inputMessage) {
//       inputMessage.value = inputMessage.value + ' ';
//     }
//   }
// });

const broadcastMessage = (username, message) => {
  //check the size of children for messagedisplay
  console.log('in broadcast', message)

  const messageDisplay = document.createElement("div");
  messageDisplay.className = "bubble";
  const newMessage = document.createElement("p");
  newMessage.innerHTML = `<strong>${username}:</strong> &nbsp${message}`;
  messageDisplay.appendChild(newMessage);
  console.log(messageDisplay)
  chatContainer.appendChild(messageDisplay)

  if (chatContainer.childNodes.length === NUM_MESSAGES) {
    //cap the num of messages at NUM_MESSAGES
    chatContainer.removeChild(chatContainer.firstChild);
  }
};

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    //state will be used to hold socket info
    this.state = {}
  }

  // THIS IS PHASER PRELOAD FUCNTION TO LOAD ALL FILES NEEDED TO CREATE SCENE
  preload() {

    // all avatars are loaded
    this.load.spritesheet('scubaPink', '/assets/scuba_divers/scubaPink.png', {
      frameWidth: 820,
      frameHeight: 420,
    });
    this.load.spritesheet('scubaGreen', '/assets/scuba_divers/scubaGreen.png', {
      frameWidth: 820,
      frameHeight: 420,
    });
    this.load.spritesheet('scubaPurple','/assets/scuba_divers/scubaPurple.png', {
        frameWidth: 820,
        frameHeight: 420,
      }
    );

    // our background scene is loaded
    this.load.image('tiles', '/assets/ocean-tilesheet.png');
    this.load.tilemapTiledJSON('tilemap', '/assets/big-ocean-level1.json');

    //Audio
    this.load.audio('music', ['/audio/Waiting_Room.mp3']);
  }

  //helper function to create avatar for player
  createPlayer (scene, player) {
    scene.scubaDiver = new Scuba(this, 100, 200, `${player.avatar}`).setScale(0.2);
    scene.scubaDiver.setAngle(-45);
    //scuba can't leave the screne
    scene.scubaDiver.body.collideWorldBounds = true;
  }

  // helper function to add animation to avatars
  createAnimations(avatar) {
    this.anims.create({
      key: 'swim',
      frames: this.anims.generateFrameNumbers(avatar, {
        start: 5,
        end: 9,
      }),
      frameRate: 5,
      repeat: -1,
    });
  }

  //helper function to add other players to scene
  addFriends(scene, player) {
    const playerFriend = scene.add.sprite(
      player.position.x + 40,
      player.position.y + 40,
      `${player.avatar}`
    ).setScale(0.2);
    playerFriend.playerId = player.playerId;
    scene.playerFriends.add(playerFriend);
  }



 // THIS IS PHASER CREATE FUNCTION TO CREATE SCENE
  create() {
    const scene = this;


    this.music = this.sound.add('music', {
      volume: 0.5,
      loop: true,
    });
    this.music.play();

    //launch the socket connection
    this.socket = io();
    //connect the socket connection to the WaitingRoom
    this.scene.launch('WaitingRoom', { socket: this.socket });
    scene.playerFriends = this.physics.add.group(); //---> WHAT DOES THIS AND IS THIS CORRECTLY IMPLIED FOR OUR PROJECT?!
    // create scene from tilemap
    const map = this.make.tilemap({ key: 'tilemap' });
    const tileset = map.addTilesetImage('ocean-scene', 'tiles');

    map.createStaticLayer('water', tileset);
    map.createStaticLayer('rocklevel1', tileset);
    map.createStaticLayer('rocklevel2', tileset);
    map.createStaticLayer('seeweed', tileset);





    //chat event listeners
    submitMemoBtn.addEventListener("click", () => {
      scene.submitMemo(scene);
    });

  //  const broadcastMessage = (username, message) =>{
  //     //check the size of children for messagedisplay
  //     if (messageDisplay.childNodes.length === NUM_MESSAGES) {
  //       //cap the num of messages at NUM_MESSAGES
  //       messageDisplay.removeChild(messageDisplay.firstChild);
  //     }
  //     const newMessage = document.createElement("p");
  //     newMessage.innerHTML = `<p><strong>${username}:</strong> &nbsp${message}</p>`;
  //     messageDisplay.appendChild(newMessage);
  //   };

    // this.inputForm = this.add
    //   .dom(400, 250)
    //   .createFromCache("name-input")
    //   .addListener("click");

    // this.inputForm.on("click", async (e) => {
    //   e.preventDefault();
    //   // console.log('in form')
    //   if (e.target.name === "submit") {
    //     const usersName = await scene.inputForm.getChildByName("name");
    //     scene.userTextName.setText(usersName.value);
    //     scene.inputForm.destroy();

    //     // this.socket.emit("setName", this.state.gameRoomName, usersName.value);
    //   }
    // });
    // scene.userTextName = this.add.text(400, 300, "");






    //create navigation and animation for scuba divers
    this.cursors = this.input.keyboard.createCursorKeys();
    // this.createAnimations();

    //Volume - add volume sound bar for display here

    // this.createPlayer(gameInfo.players[socketId])
    this.socket.on('setState', function(gameInfo){
      const { key, players, avatars, score, level, questions, facts } = gameInfo;
      //this.physics.resume() ----> WHAT DOES THIS??

      //set state to gameInfo
      scene.state.key = key;
      scene.state.players = players;
      scene.state.avatars = avatars;
      scene.state.score = score;
      scene.state.level = level;
      scene.state.questions = questions;
      scene.state.facts = facts;
    })

    this.socket.on('currentPlayers', function({ players, numPlayers }) {
      scene.state.numPlayers = numPlayers;
      Object.keys(players).forEach( function(id){
        if(players[id].playerId === scene.socket.id){
          scene.createPlayer(scene, players[id])
        } else {
          scene.addFriends(scene, players[id]);
        }
      });
    });
    //listen to add new player to scene
    this.socket.on('newPlayer', function({ newPlayer, numPlayers }) {
      scene.addFriends(scene, newPlayer);
      scene.state.numPlayers = numPlayers;


    })

    this.socket.on('broadcastMessage', function ({username, message}){
      console.log('username in bc', username)
      broadcastMessage(username, message)
    })

 }

  update() {
    const scene = this;
    //update the movement
    if(this.scubaDiver) {
      this.scubaDiver.update(this.cursors);
    }
    // socket.emit('playerMoved')...
   scene.submitMemo = (scene) => {
      // If the message is non-empty, send it, else do nothing


      if (memoInput.value) {

        console.log(scene.state.key)
        scene.socket.emit(
          "submitMemo",
          scene.state.key,
          scene.state.players[this.socket.id].avatar || "Anonymous",
          memoInput.value
        );
        memoInput.value = "";
      }
    }

  }
}

//SET SCREEN SIZE
// var windowWidth = window.innerWidth;
// var widnowHeight = window.innerHeight;
// this.bg = this.add.image(windowWidth / 2, widnowHeight / 2, 'sky');
// this.bg.setDisplaySize(windowWidth, widnowHeight);
