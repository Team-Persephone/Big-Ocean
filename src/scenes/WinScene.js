import Phaser from "phaser";

export default class WinScene extends Phaser.Scene {
	constructor() {
		super("WinScene");
	}

	init(data) {
		this.scubaDiver = data.scubaDiver;
		this.playerFriends = data.playerFriends
	}

	preload() {
		this.load.image("darkocean", "assets/darkocean.png")
		this.load.image("bubblecopy", "/assets/bubble-blankcopy.png");
		this.load.image("littlebubble", "/assets/littlebubble.png");
		this.load.audio("gameWin", "/audio/gameWin.mp3");
	}

	async create() {
		const scene = this;
		this.gameWin = this.sound.add("gameWin", { volume: 2 });
		this.gameWin.play();

		scene.add.image(400, 300, "darkocean").setScale(0.25);
		scene.graphics = scene.add.image(400, 260, "bubblecopy").setScale(0.9);

		//congrats!
		scene.add.text(235, 110, "cOngratulatiOns!", {
			fill: "#02075D",
			fontSize: "34px",
			fontStyle: "bold"
		});

		//player's message and score
		scene.add.text(
			210,
			155,
			`\nyOu cOllected all the pearls & wOn!\n\n here is hOw yOu did: \n\n ${this.scubaDiver.avatar}: ${this.scubaDiver.score}`,
			{
				fill: "#02075D",
				fontSize: "17px",
				fontStyle: "bold",
				align: "center",
				wordWrap: { width: 400, height: 300, useAdvancedWrap: true }
			}
		);
			let y = 275;
			this.playerFriends.getChildren().forEach(friend => {
				this.add.text(
					335,
					y,
					`${friend.avatar}: ${friend.score}`
				)
			y += 20
			})
			
			const createGameButton = this.add.text(300, 330, " play again here! ", {
				fontSize: "20px",
				fontStyle: "bold",
				fill: "#FFFFFF",
				backgroundColor: "#02075D",
			});

			createGameButton.setInteractive();
			createGameButton.on("pointerdown", () => {
				if (window.location.pathname.length > 1) {
				window.open(`${window.location.href.slice(0, window.location.href.length - 6)}`,
					"_blank"
			)} else {
				window.open(`${window.location.pathname}`), 
				"_blank"
			}		
			});

		//credits
		scene.add.text(
			245,
			370,
			"One-big-Ocean is brOught tO yOu by \n\nasia thOmas, isabelle stettler, \n\n Olivia wOng, & sOfija suttOn.",
			{
				fill: "#02075D",
				fontSize: "14px",
				align: "center",
				wordWrap: { width: 400, height: 400, useAdvancedWrap: true }
			}
		);
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
