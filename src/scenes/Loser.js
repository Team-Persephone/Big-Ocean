import Phaser from "phaser";

export default class Loser extends Phaser.Scene {
	constructor() {
		super("Loser");
	}
	init(data) {
		this.scene.scubaDiver = data.scubaDiver;
	}
	preload() {
		// this.load.image("blue", "/assets/background/babyGotBlue.png");
		// this.load.image("blue", "/assets/background/babyGotBlue.png");
		this.load.image("darkocean", "assets/darkocean.png")
		this.load.image("bubble", "/assets/bubble-blank.png");
		this.load.image("logo", "assets/logo.png");

		this.load.audio("gameOver", "/audio/gameOver.mp3");
	}
	async create() {
		const scene = this;
		// console.log('in loser', this.scene.scubaDiver.avatar);
		this.gameOver = this.sound.add("gameOver", { volume: 2 });
		this.gameOver.play();
		scene.add.image(400, 300, "darkocean").setScale(0.25);
		scene.graphics = scene.add.image(400, 260, "bubble").setScale(0.9);
		//loser!
		scene.add.text(245, 130, "ya basic!", {
			fill: "#02075D",
			fontSize: "34px",
			fontStyle: "bold",
			align: "center"
		});
		//Game over message
		scene.add.text(
			245,
			175,
			`\ngame Over\n\n Your score: ${this.scene.scubaDiver.score}`,
			// `\ngame Over\n\n ${this.scene.scubaDiver.avatar}: ${this.scene.scubaDiver.score}`,
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
		// var bg = this.add.image(400, 300, 'bubble').setScale(3);
		var particles = this.add.particles('fillin');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    var logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);

	}
}
