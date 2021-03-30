import phaser from "phaser";

const memoInput = document.getElementsByClassName("chat-input")[0];
const chatContainer = document.getElementById("playerChatId");

const NUM_MESSAGES = 10;

const broadcastMessage = (username, message) => {
	//check the size of children for messagedisplay
	console.log("in broadcast", message);
	const messageDisplay = document.createElement("div");
	messageDisplay.className = "bubble";
	const newMessage = document.createElement("p");
	newMessage.innerHTML = `<strong>${username}:</strong> &nbsp;${message}`;
	messageDisplay.appendChild(newMessage);
	console.log(messageDisplay);
	chatContainer.appendChild(messageDisplay);
	if (chatContainer.childNodes.length === NUM_MESSAGES) {
		//cap the num of messages at NUM_MESSAGES
		chatContainer.removeChild(chatContainer.firstChild);
	}
};



export default class ChatScene extends Phaser.Scene {
	constructor() {
		super("ChatScene");
		//state will be used to hold socket info
		this.state = {};
	}
	init(data) {
		this.socket = data.socket;
	}
	// THIS IS PHASER PRELOAD FUCNTION TO LOAD ALL FILES NEEDED TO CREATE SCENE
	preload() {}

	create() {
		const scene = this;

		//chat event listeners on enter key
		memoInput.addEventListener("keydown", e => {
			if (!e) e = window.event;
			// e.preventDefault();
			if (e.keyCode === 13) scene.submitMemo(scene);
		});

		//create navigation and animation for scuba divers
		this.socket.on("setState", function (gameInfo) {
			const {
				key,
				players,
				avatars,
				score,
				level,
				questions,
				facts
			} = gameInfo;
			//this.physics.resume() ----> WHAT DOES THIS??

			//set state to gameInfo
			scene.state.key = key;
			scene.state.players = players;
			scene.state.avatars = avatars;
			scene.state.score = score;
			scene.state.level = level;
			scene.state.questions = questions;
			scene.state.facts = facts;
		});
    
		this.socket.on("broadcastMessage", function ({ username, message }) {
			broadcastMessage(username, message);
		});
	}

	update() {
		const scene = this;
		//update the movement

		// socket.emit('playerMoved')...
		scene.submitMemo = scene => {
			// If the message is non-empty, send it, else do nothing

			console.log("button clicked!");
			if (memoInput.value) {
				// console.log(scene.state.key)
				scene.socket.emit(
					"submitMemo",
					scene.state.key,
					scene.state.players[this.socket.id].avatar || "Anonymous",
					memoInput.value
				);
				//console.log('scene in main', scene)
				console.log(memoInput.value, "memovalue <---");
				memoInput.value = "";
			}
		};
	}
}
