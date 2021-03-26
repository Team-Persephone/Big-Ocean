import init from "connect-session-sequelize";
import Phaser from "phaser";

export default class Question extends Phaser.Scene {
	constructor() {
		super("Question");
	}
	
	init(data) {
		this.info= data.info;
	}

	preload() {}

	create() {
		console.log('you clicked me!')
		this.questionBox = this.add.graphics();
		this.questionBox.lineStyle(2, 0x3DABF3, 1);	
		this.questionBox.fillStyle(0x3DABF3, 1.0);
		this.questionBox.fillRoundedRect(32, 32, 300, 200, 32)
		// this.add.text(0, 0, `${this.info.question}`)

	}

	update() {}
}
