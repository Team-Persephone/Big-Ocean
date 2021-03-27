import Phaser from "phaser";

export default class Question extends Phaser.Scene {
	constructor() {
		super("Question");
	}

	init(data) {
		this.info = data.info;
		this.scubaDiver = data.scubaDiver;
		this.level = data.level;
	}

	preload() {}

	isCorrect(answer) {
		if (answer === this.info.answer) {
			console.log("right answer!!!!");
			this.scubaDiver.frozen = false;
			this.scubaDiver.score = this.scubaDiver.score + this.level
			console.log('after score', this.scubaDiver.score) //score is working here, does nit show though
			this.info.isResolved = true;
		} else {
			console.log("you are so wrong!");
		}
		this.scene.stop("Question");
	}
	create() {
		const info = this.info;
		const scene = this;
		console.log("you clicked me!");
		this.add.text(50, 50, `${info.question}`, {
			fill: "#02075D",
			backgroundColor: "#1abeff",
			fontSize: "17px",
			fontStyle: "bold",
			align: "left",
			wordWrap: { width: 700, height: 445, useAdvancedWrap: true }
		});
		let x = 50;
		info.options.forEach(option => {
			scene.add
				.text(x, 100, `${option}`, { fill: "#02075D" })
				.setInteractive()
				.on("pointerdown", () => {
					this.isCorrect(option);
				});
			x += 200;
		});
	}

	update() {}
}
