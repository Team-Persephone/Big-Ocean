import Phaser from "phaser";

export default class Instructions extends Phaser.Scene {
	constructor() {
		super("Instructions");
	}

	preload() {
		this.load.image("bubble", "/assets/bubble-blank.png");
	}

	async create() {
		const scene = this;

		scene.graphics = scene.add.image(400, 260, "bubble").setScale(1);

		scene.add.text(275, 100, "instructiOns", {
			fill: "#02075D",
			// backgroundColor: "#1abeff",
			fontSize: "34px",
			fontStyle: "bold"
		});

		scene.add.text(
			200,
			140,
			"\n1. navigate yOur surrOundings + lOcate preciOus clams, whOse pearls cOntain ancient queries On big-O nOtatiOn. \n\n\n\n 2. dOn’t fOrget tO keep an eye On the clOck.\n\n\n3. need help? apprOach a shrimp fOr a hint.\n\n\n 4. finish with the mOst pOints, and win the title of “mighty O.” \n\n\n 5. ready tO play? click the buttOn belOw tO cOntinue.",
			{
				fill: "#02075D",
				//   backgroundColor: "#1abeff",
				fontSize: "17px",
				fontStyle: "bold",
				align: "center",
				wordWrap: { width: 400, height: 400, useAdvancedWrap: true }
			}
		);
	}
}
