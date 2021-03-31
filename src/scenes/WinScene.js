import Phaser from "phaser";

export default class WinScene extends Phaser.Scene {
	constructor() {
		super("WinScene");
	}

	init(data) {
		this.playerFriends = data.playerFriends; ///this only passes in create info, need to set up socket to see other player's scores
		this.scubaDiver = data.scubaDiver;
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
		scene.add.text(245, 130, "cOngratulatiOns!", {
			fill: "#02075D",
			fontSize: "34px",
			fontStyle: "bold"
		});
		//player's message and score
		//let y = 300;
		scene.add.text(
			245,
			175,
			`\nyOu cOllected all the pearls!\n\n yOu all win!\n\n but here is hOw yOu did: \n\n ${this.scubaDiver.avatar}: ${this.scubaDiver.score}`,
			{
				fill: "#02075D",
				fontSize: "19px",
				fontStyle: "bold",
				align: "center",
				wordWrap: { width: 400, height: 300, useAdvancedWrap: true }
			}
		);
		
		//Add other player's scores (needs socket hook up)
		// scene.add.text(
		// 	`${this.playerFriends.getChildren().forEach(friend => {
		// 		this.add.text(350, y, `${friend.avatar}: ${friend.score}`);
		// 		y += 20;
		// 	})}`
		// );

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

		//Add replay option
	}
}