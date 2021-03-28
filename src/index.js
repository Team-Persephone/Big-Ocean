/** @type {import("../typings/phaser")} */
/*At some point, the typings will
be officially added to the official release so that all you'll have to do is do:

npm install @types/phaser

But this hasn't happened yet!*/

import "phaser";
import config from "./config/config";
import MainScene from "./scenes/Mainscene";
import IntroScene from "./scenes/IntroScene";
import ChatScene from "./scenes/ChatScene";
import Instructions from "./scenes/Instructions";
import Question from "./scenes/Question";
import Facts from "./scenes/Facts";

class Game extends Phaser.Game {
	constructor() {
		super(config);

		this.scene.add("MainScene", MainScene);
		this.scene.add("IntroScene", IntroScene);
		this.scene.add("ChatScene", ChatScene);
		this.scene.add("Instructions", Instructions);
		this.scene.add("Question", Question);
		this.scene.add("Facts", Facts);
		this.scene.start("MainScene");
	}
}

window.onload = function () {
	window.game = new Game();
};
