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
		scuba.frozen = true;
		while (time > 0) {
			console.log(time)
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
		this.add.text(50, 50, `${info.fact}`, {
			fill: "#00ff00",
			backgroundColor: "#1abeff",
			fontSize: "17px",
			fontStyle: "bold",
			align: "left",
			wordWrap: { width: 700, height: 445, useAdvancedWrap: true }
		});
		this.startTimer(7, this.shrimp, this.scubaDiver, "Facts")
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

