import Phaser from "phaser";

export default class IntroScene extends Phaser.Scene {
	constructor() {
		super("IntroScene");
	}
	//get scoket data as props from MainRoom
	init(data) {
		this.socket = data.socket;
	}

	// THIS IS PHASER PRELOAD FUCNTION TO LOAD ALL FILES NEEDED TO CREATE SCENE
	preload() {
		this.load.image("blue", "/assets/background/babyGotBlue.png");
	}

	// THIS IS PHASER CREATE FUNCTION TO CREATE SCENE
	create() {
		const scene = this;
		let key;
		this.scene.launch("IntroScene", { socket: this.socket });
		this.add.image(0, 0, "blue").setScale(2);
		//this.scene.launch("WinScene");
		this.scene.launch("Instructions");

		//if there is a gameKey in the url, stop the waiting room because the code was already generated
		if (window.location.pathname.length > 1) {
			//gets gameKey from url
			key = window.location.pathname.slice(1);
			this.socket.emit("joinWaitingRoom", key);
		//	this.scene.launch("WinScene")
			this.scene.launch("Instructions");
			this.scene.stop("IntroScene");
			// return;
		}
		//OTHERWISE THIS:
		// add button to create game to scene
		const createGameButton = this.add.text(600, 500, "create new game", {
			fontFamily: "menlo"
		});
		createGameButton.setInteractive();
		createGameButton.on("pointerdown", () => {
			createGameButton.setVisible(false);
			// joinGameButton.setVisible(true);
			this.socket.emit("createGame");
		});

		this.socket.on("gameCreated", key => {
			this.socket.emit("joinWaitingRoom", key);
			this.scene.stop("IntroScene");
			//this.scene.stop("WinScene")
			this.scene.stop("Instructions");
		});

		// 	const joinGameButton = this.add.text(600, 500, "jOin game!", {
		// 		fontFamily: "menlo"
		// 	});
		// 	joinGameButton.setVisible(false);
		// 	joinGameButton.setInteractive();
		// 	joinGameButton.on("pointerdown", () => {
		// 		joinGameButton.setVisible(false);

		// 	});
	}

	update() {}
}

// server: when socket connection is made, (aka, when someone lands on the intro) write a function to create a unique code and emit that code back to the frontend
// client: when the frontend receives the unique code, the unique code is appended to the a href on the "play" button, aka: one.big.ocean.herokuapp.com/8D4F3
// one.big.ocean.herokuapp.com/8D4F3 brings user to the waitingroom
// user can send the unique URL to friends to join the same waiting room.
