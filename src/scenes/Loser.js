import Phaser from "phaser";

export default class Loser extends Phaser.Scene {
	constructor() {
		super("Loser");
	}
	init(data) {
		this.scene.scubaDiver = data.scubaDiver;
		this.playerFriends = data.playerFriends;
	}
	preload() {
		this.load.image("darkocean", "assets/darkocean.png");
		this.load.image("bubblecopy", "/assets/bubble-blankcopy.png");
		this.load.image("littlebubble", "/assets/littlebubble.png");
		this.load.audio("gameOver", "/audio/gameOver.mp3");
	}
	async create() {
		const scene = this;
		this.gameOver = this.sound.add("gameOver", { volume: 2 });
		this.gameOver.play();
		scene.add.image(400, 300, "darkocean").setScale(0.25);
		scene.graphics = scene.add.image(400, 260, "bubblecopy").setScale(0.9);
		//loser!
		scene.add.text(300, 130, "game Over", {
			fill: "#02075D",
			fontSize: "34px",
			fontStyle: "bold",
			align: "center"
		});

		let y = 250;
		this.playerFriends.getChildren().forEach(friend => {
			this.add.text(320, y, `${friend.avatar}: ${friend.score}`, {
				fill: "#02075D",
				fontSize: "19px",
				wordWrap: { width: 400, height: 300, useAdvancedWrap: true }
			});
			y += 20;
		});
		//Game over message
		scene.add.text(320, 175, `\nyOur scOre: ${this.scene.scubaDiver.score}`, {
			fill: "#ffffff",
			fontSize: "19px",
			fontStyle: "bold",
			align: "center",
			wordWrap: { width: 400, height: 300, useAdvancedWrap: true }
		});

		//credits
		scene.add.text(
			255,
			360,
			"One-big-Ocean is brOught tO yOu by \n\nasia thOmas, isabelle stettler, \n\n sOfija suttOn, & Olivia wOng.",
			{
				fill: "#02075D",
				fontSize: "14px",
				align: "center",
				wordWrap: { width: 400, height: 400, useAdvancedWrap: true }
			}
		);

		const createGameButton = this.add.text(300, 330, " play again here! ", {
			fontSize: "20px",
			fontStyle: "bold",
			fill: "#FFFFFF",
			backgroundColor: "#02075D"
		});
		createGameButton.setInteractive();
		createGameButton.on("pointerdown", () => {
			if (window.location.pathname.length > 1) {
				window.open(
					`${window.location.href.slice(0, window.location.href.length - 6)}`,
					"_blank"
				);
			} else {
				window.open(`${window.location.pathname}`), "_blank";
			}
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
}
