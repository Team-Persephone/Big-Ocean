/** @type {import("../typings/phaser")} */
/*At some point, the typings will
be officially added to the official release so that all you'll have to do is do:

npm install @types/phaser

But this hasn't happened yet!*/

import 'phaser';
import config from './config/config';

class Game extends Phaser.Game {
    constructor() {
        super(config);
    }
}

window.onload = function () {
    window.game = new Game();
}