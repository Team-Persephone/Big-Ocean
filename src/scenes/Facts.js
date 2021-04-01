import Phaser from "phaser";

export default class Facts extends Phaser.Scene {
	constructor() {
		super("Facts");
	}

	init(data) {
		this.shrimp = data.shrimp;
		this.socket = data.socket;
		this.level = data.level;
		this.scubaDiver = data.scubaDiver;
		this.click = data.click;
		this.key = data.key;
	}

	preload() {}

	async sleep(delay) {
		return new Promise(resolve => setTimeout(() => resolve(true), delay));
	}

	async startTimer(time, animal, scuba, view = null) {
		this.click.play();
		scuba.frozen = true;
		while (time > 0) {
			this.timeRemaining.setText(`fact-O-timer: ${time}`);
			console.log(time);
			await this.sleep(1000);
			time--;
		}
		if (view) {
			this.scene.stop(view);
		}
		scuba.frozen = false;
		animal.disableInteractive();
		this.click.stop();
	}

	create() {
		const info = this.shrimp.info;
		this.timeRemaining = this.add.text(50, 180, "", {
			fill: "#FFFFFF",
			backgroundColor: "#02075D",
			fontSize: "17px",
			fontStyle: "bold",
			align: "center"
		});
		this.add.text(50, 200, `${info.fact}`, {
			fill: "#FFFFFF",
			backgroundColor: "#02075D",
			fontSize: "17px",
			fontStyle: "bold",
			align: "left",
			wordWrap: { width: 700, height: 445, useAdvancedWrap: true }
		});
		this.startTimer(7, this.shrimp, this.scubaDiver, "Facts");
		this.scubaDiver.score = Number(
			(this.scubaDiver.score + this.level / 2).toFixed(1)
		);
		this.scubaDiver.updateScore(this.score);
		this.socket.emit("Scored", {
			key: this.key,
			playerId: this.scubaDiver.playerId,
			score: this.scubaDiver.score
		});
	}

	update() {}
}
