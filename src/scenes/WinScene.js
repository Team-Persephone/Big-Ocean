import Phaser from "phaser";

export default class WinScene extends Phaser.Scene {
	constructor() {
		super("WinScene");
	}

    init(data) {
		this.info = data.info;
		this.socket = data.socket;
		this.score = data.score;
	}

	preload() {
		this.load.image("bubble", "/assets/bubble-blank.png");
	}

	async create() {
		const scene = this;
        console.log(this, 'this in winScene');

		scene.graphics = scene.add.image(400, 260, "bubble").setScale(0.9);

		scene.add.text(275, 100, "cOngratulatiOns! yOu answered all the pearls!", {
			fill: "#02075D",
			fontSize: "34px",
			fontStyle: "bold"
		});

		scene.add.text(
			200,
			150,
			'yOu all win!\n\n but here is hOw it all breaks dOwn:',
			{
				fill: "#02075D",
				fontSize: "17px",
				fontStyle: "bold",
				align: "center",
				wordWrap: { width: 400, height: 400, useAdvancedWrap: true }
			}
		);
	}
}
