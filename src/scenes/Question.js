import Phaser from "phaser";

export default class Question extends Phaser.Scene {
	constructor() {
		super("Question");
	}

	init(data) {
		this.clam = data.clam;
		this.scubaDiver = data.scubaDiver;
		this.level = data.level;
		this.socket = data.socket;
		this.key = data.key;
		this.score = data.score;
		this.click = data.click;
	}

	preload() {
		//return to surface sound
		this.load.audio("surface", "/audio/water-surface.mp3");
		//correct clam sound
		this.load.audio("correct", "/audio/correct.mp3");
	}
	onEvent() {
		this.click.play();
		this.timeRemaining.setText(`the O-timer: ${this.timer.repeatCount}`);
		if (this.timer.repeatCount === 0) {
			this.scubaDiver.tweenPosition(0, 0);
			this.click.stop();
			this.scene.stop("Question");
			this.surface.play();
			this.scubaDiver.frozen = false;
			this.socket.emit("QuestionOpen", {
				clamInfo: this.clam.info,
				key: this.key,
				level: this.level
			});
		}
	}
	isCorrect(answer) {
		this.click.stop();
		if (answer === this.clam.info.answer) {
			console.log("right answer!!!!");
			this.correct.play();
			this.timer.paused = !this.timer.paused;
			this.scubaDiver.frozen = false;
			this.scubaDiver.score = this.scubaDiver.score + this.level;
			this.scubaDiver.updateScore(this.score);
			this.socket.emit("Scored", {
				key: this.key,
				playerId: this.scubaDiver.playerId,
				score: this.scubaDiver.score,
				clamQuestion: this.clam.info.question,
				level: this.level
			});
		} else {
			console.log("you are so wrong!");
			this.scubaDiver.tweenPosition(0, 0);
			this.surface.play();
			this.scubaDiver.frozen = false;
			this.timer.paused = !this.timer.paused;
			this.socket.emit("QuestionOpen", {
				clamInfo: this.clam.info,
				key: this.key,
				level: this.level
			});
		}
		this.scene.stop("Question");
	}
	create() {
		const info = this.clam.info;
		const scene = this;

		const time = this.level < 4 ? 10 : this.level === 4 ? 15 : 20;
		this.scubaDiver.frozen = true;
		this.timer = this.time.addEvent({
			delay: 1000,
			callback: this.onEvent,
			callbackScope: this,
			repeat: time
		});
		this.timeRemaining = this.add.text(50, 140, "", {
			fill: "#FFFFFF",
			backgroundColor: "#02075D",
			fontSize: "17px",
			fontStyle: "bold",
			align: "center"
		});
		this.surface = this.sound.add("surface", { volume: 1.5 });
		this.correct = this.sound.add("correct", { volume: 1 });

		let questionContainer = this.add.text(50, 160, `${info.question}`, {
			fill: "#FFFFFF",
			backgroundColor: "#02075D",
			fontSize: "15px",
			fontStyle: "bold",
			align: "left",
			wordWrap: { width: 700, height: 445, useAdvancedWrap: true }
		});

		let x = 50;
		let y = questionContainer.getBottomLeft().y + 20;

		info.options.forEach(option => {
			scene.add
				.text(x, y, `${option.split(",").join(`\n`)}`, {
					fill: "#FFFFFF",
					backgroundColor: "#02075D",
					fontSize: "15px",
					wordWrap: { width: 300, height: 445, useAdvancedWrap: true }
				})
				.setInteractive()
				.on("pointerdown", () => {
					this.isCorrect(option);
				});
			x += 200;
		});
	}

	update() {}
}
