import Phaser from "phaser";

export default class Question extends Phaser.Scene {
	constructor() {
		super("Question");
	}

	init(data) {
		this.socket = data.socket;
	}

	preload() {}

	create() {
		this.questionPopUp = scene.add.graphics();

		this.questionPopUp.lineStyle(5, 0xff00ff, 1.0);
		this.questionPopUp.fillStyle(0xffffff, 1.0);
	}

	update() {}
}
