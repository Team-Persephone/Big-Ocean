import Phaser from "phaser";

export default class Question extends Phaser.Scene {
	constructor() {
		super("Question");
	}

	init(data) {
		this.info = data.info;
		this.scubaDiver = data.scubaDiver;
		this.level = data.level;
		this.socket = data.socket;
		this.key = data.key;
	}

	preload() {
		//return to surface sound
		this.load.audio("surface", "/audio/water-surface.mp3");
		//correct clam sound
		this.load.audio("correct", "/audio/correct.mp3");
	}

	isCorrect(answer) {
		if (answer === this.info.answer) {
			console.log("right answer!!!!");
			this.correct.play();
			this.scubaDiver.frozen = false;
			this.scubaDiver.score = this.scubaDiver.score + this.level;
			console.log("after score", this.scubaDiver.score); //score is working here, does nit show though
			this.info.isResolved = true;
			this.socket.emit("Scored", {
				key: this.key,
				playerId: this.scubaDiver.playerId,
				score: this.scubaDiver.score,
				answer: this.info.answer,
				level: this.level
			});
		} else {
			console.log("you are so wrong!");
			// this.scubaDiver.setPosition(0, 0)

			this.scubaDiver.tweenPosition(0, 0);
			this.surface.play();
			this.scubaDiver.frozen = false;
		}
		this.scene.stop("Question");
	}
	create() {
		const info = this.info;
		const scene = this;

		this.surface = this.sound.add("surface", { volume: 1.5 });
		this.correct = this.sound.add("correct", { volume: 1 });


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
