import Phaser from "phaser";

export default class Loser extends Phaser.Scene {
	constructor() {
		super("Loser");
	}
	// init(data) {
	// 	// this.scubaDiver = data.scubaDiver;
	// }
	preload() {
		console.log("in preload");
		this.load.image("blue", "/assets/background/babyGotBlue.png");
		this.load.image("bubble", "/assets/bubble-blank.png");
		this.load.audio("gameOver", "/audio/gameOver.mp3");
	}
	async create() {
		const scene = this;
		console.log("in loser scene");
		this.gameOver = this.sound.add("gameOver", { volume: 2 });
		this.gameOver.play();
		scene.add.image(0, 0, "blue").setScale(2);
		scene.graphics = scene.add.image(400, 260, "bubble").setScale(0.9);
		//loser!
		scene.add.text(245, 130, "ya basic!", {
			fill: "#02075D",
			fontSize: "34px",
			fontStyle: "bold"
		});
		//Game over message
		scene.add.text(
			245,
			175,
			`\Your mamma's so fat, the recursive function computing her mass caused a stack overflow.`,
			{
				fill: "#02075D",
				fontSize: "19px",
				fontStyle: "bold",
				align: "center",
				wordWrap: { width: 400, height: 300, useAdvancedWrap: true }
			}
		);

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
	}
}
