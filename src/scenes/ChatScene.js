
import phaser from 'phaser';


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

export default class ChatScene extends Phaser.Scene {
  constructor() {
    super('ChatScene');
    //state will be used to hold socket info
    this.state = {}
  }
  init(data){
    this.socket = data.socket
  }
  // THIS IS PHASER PRELOAD FUCNTION TO LOAD ALL FILES NEEDED TO CREATE SCENE
  preload() {

  }

  create() {
    const scene = this;

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

    //create navigation and animation for scuba divers

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
    console.log('state', scene.state)
    this.socket.on('broadcastMessage', function ({username, message}){
      console.log('username in bc', username)
      broadcastMessage(username, message)
    })

 }

  update() {
    const scene = this;
    //update the movement

    // socket.emit('playerMoved')...
   scene.submitMemo = (scene) => {
      // If the message is non-empty, send it, else do nothing

console.log('button clicked!')
      if (memoInput.value) {

        console.log(scene.state.key)
        scene.socket.emit(
          "submitMemo",
          scene.state.key,
          scene.state.players[this.socket.id].avatar || "Anonymous",
          memoInput.value
        );
        console.log('scene in main', scene)
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