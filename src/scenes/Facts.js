import Phaser from "phaser";

export default class Facts extends Phaser.Scene {
	constructor() {
		super("Facts");
	}
	
	init(data) {
		this.info= data.info;
	}

	preload() {}

	create() {
		const info = this.info
        console.log('yey clicked!')
		this.add.text(50, 50, `${info.fact}`, {
		fill: "#00ff00",
        backgroundColor: "#1abeff",
        fontSize: "17px",
        fontStyle: "bold",
        align: "left",
        wordWrap: { width: 700, height: 445, useAdvancedWrap: true },
      })
	}

	update() {}
}
