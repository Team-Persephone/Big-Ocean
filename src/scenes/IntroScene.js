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
		this.load.image("littlebubble", "/assets/littlebubble.png");
	}

	// THIS IS PHASER CREATE FUNCTION TO CREATE SCENE
	create() {
		const scene = this;
		let key;
		this.scene.launch("IntroScene", { socket: this.socket });
		this.add.image(0, 0, "blue").setScale(2);
		this.scene.launch("Instructions");

		//if there is a gameKey in the url, stop the waiting room because the code was already generated

		if (window.location.pathname.length > 1) {
			key = window.location.pathname.slice(1);
			this.socket.emit("joinWaitingRoom", key);
			this.scene.launch("Instructions");
			this.scene.stop("IntroScene");
		}

		const createGameButton = this.add.text(600, 500, "create new game", {
			fontFamily: "menlo"
		});
		createGameButton.setInteractive();
		createGameButton.on("pointerdown", () => {
			createGameButton.setVisible(false);
			this.socket.emit("createGame");
		});

		this.socket.on("gameCreated", key => {
			this.socket.emit("joinWaitingRoom", key);
			this.scene.stop("IntroScene");
			this.scene.stop("Instructions");
		});

		this.socket.on("gameFull", () => {
			this.scene.stop("MainScene");
			this.scene.stop("Instructions");
			this.scene.launch("GameFull", { socket: this.socket });
		});

		//mouse bubbles
		var particles = this.add.particles("littlebubble");

		var emitter = particles.createEmitter({
			speed: 100,
			scale: { start: 1, end: 0 },
			blendMode: "ADD"
		});

		this.input.on("pointermove", function (pointer) {
			emitter.setPosition(pointer.x, pointer.y);
		});
	}

	update() {}
}
