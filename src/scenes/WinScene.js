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
		this.load.image("blue", "/assets/background/babyGotBlue.png");
		this.load.image("bubble", "/assets/bubble-blank.png");
		this.load.audio("gameWin", "/audio/gameWin.mp3");
	}

	async create() {
		const scene = this;
		this.gameWin = this.sound.add("gameWin", { volume: 2 });
		this.gameWin.play();

		scene.add.image(0, 0, "blue").setScale(2);
		scene.graphics = scene.add.image(400, 260, "bubble").setScale(0.9);

		//congrats!
		scene.add.text(245, 125, "cOngratulatiOns!", {
			fill: "#02075D",
			fontSize: "34px",
			fontStyle: "bold"
		});

		//player's message and score
		scene.add.text(
			245,
			165,
			`\nyOu cOllected all the pearls!\n\n yOu all win!\n\n but here is hOw yOu all did: \n\n ${this.scubaDiver.avatar}: ${this.scubaDiver.score}`,
			{
				fill: "#02075D",
				fontSize: "19px",
				fontStyle: "bold",
				align: "center",
				wordWrap: { width: 400, height: 300, useAdvancedWrap: true }
			}
		);
			let y = 315;
			this.playerFriends.getChildren().forEach(friend => {
				this.add.text(
					345,
					y,
					`${friend.avatar}: ${friend.score}`
				)
				y += 20
			})

		//credits
		scene.add.text(
			255,
			360,
			"One-big-Ocean is brOught tO yOu by \n\nasia thOmas, isabelle stettler, \n\n Olivia wOng, & sOfija suttOn.",
			{
				fill: "#02075D",
				fontSize: "14px",
				align: "center",
				wordWrap: { width: 400, height: 400, useAdvancedWrap: true }
			}
		);
	}
}
