import Phaser from "phaser";

export default class Question extends Phaser.Scene {
	constructor() {
		super("Question");
	}
	
	init(data) {
		this.info= data.info;
	}

	preload() {}

	isCorrect(answer) {
		if(answer === this.info.answer) {
			console.log('right answer!!!!')
		} else { 
			console.log('you are so wrong!')
		}
		this.scene.stop("Question");
	}
	create() {
		const info = this.info
		const scene = this;
		console.log('you clicked me!')
		this.add.text(50, 50, `${info.question}`, {
		fill: "#00ff00",
        backgroundColor: "#1abeff",
        fontSize: "17px",
        fontStyle: "bold",
        align: "left",
        wordWrap: { width: 700, height: 445, useAdvancedWrap: true },
      })
		let x = 50;
	  	info.options.forEach(option => {
			  scene.add.text(x, 100, `${option}`, {
				fill: "#00ff00",
				fontSize: "17px",
				fontStyle: "bold",
				align: "left",
				wordWrap: { width: 700, height: 445, useAdvancedWrap: true },
			  }).setInteractive().on("pointerdown", () => {this.isCorrect(option) })
			  x += 200;
		  })
	}

	update() {}
}
