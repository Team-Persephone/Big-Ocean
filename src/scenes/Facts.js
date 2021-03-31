import Phaser from "phaser";

export default class Facts extends Phaser.Scene {
	constructor() {
		super("Facts");
	}

	init(data) {
		this.info = data.info;
		this.socket = data.socket;
		this.level = data.level;
		this.scubaDiver = data.scubaDiver;
	}

	preload() {}

	create() {
		const info = this.info;
		console.log("yey clicked!");
		this.add.text(50, 50, `${info.fact}`, {
			fill: "#00ff00",
			backgroundColor: "#1abeff",
			fontSize: "17px",
			fontStyle: "bold",
			align: "left",
			wordWrap: { width: 700, height: 445, useAdvancedWrap: true }
		});
	}

	update() {}
}

// this.socket.emit("Scored", {
// 	key: this.state.key,
// 	playerId: this.scubaDiver.playerId,
// 	score: this.scubaDiver.score
// });

// this.scubaDiver.score = Number(
// 	(this.scubaDiver.score + this.state.level / 2).toFixed(1)
// );
// this.scubaDiver.updateScore(this.score);
