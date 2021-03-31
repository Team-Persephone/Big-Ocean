import Phaser from "phaser";

export default class GameFull extends Phaser.Scene {
	constructor() {
		super("GameFull");
	}

	init(data) {
		this.socket = data.socket;
	}

	preload() {
		this.load.image("bubble", "/assets/bubble-blank.png");
	}

	async create() {
		const scene = this;

		scene.graphics = scene.add.image(400, 260, "bubble").setScale(0.9);

		scene.add.text(220, 250, "sOrry, this game is full", {
			fill: "#02075D",
			fontSize: "25px",
			fontStyle: "bold"
		});

		const createGameButton = this.add.text(330, 320, "gO back hOme", {
			fill: "#02075D",
			fontSize: "20px",
			fontStyle: "bold"
		});
		createGameButton.setInteractive();
		createGameButton.on("pointerdown", () => {
			window.open(
				`${window.location.href.slice(0, window.location.href.length - 6)}`,
				"_blank"
			);
		});

		this.socket.on("gameCreated", key => {
			this.socket.emit("joinWaitingRoom", key);
			this.scene.stop("GameFull");
		});
	}
}
