import phaser from 'phaser';

import Scuba from '../entities/Scuba';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.state = {
      key: '',
      player: {},
      score: {},
      level: 1,
      questions: [],
      facts: [],
      taskPositions: {},
    };
  }

  preload() {
    this.load.image('woman', '/assets/woman h1.png');
    this.load.spritesheet('scubaOne', '/assets/scubaOne.png', {
      frameWidth: 800,
      frameHeight: 460,
    });

    this.load.image('tiles', '/assets/ocean-tilesheet.png');
    this.load.tilemapTiledJSON('tilemap', '/assets/big-ocean-level1.json');
  }
  create() {
    this.socket = io();
    this.scene.launch('WaitingRoom', { socket: this.socket });

    const map = this.make.tilemap({ key: 'tilemap' });
    const tileset = map.addTilesetImage('ocean-scene', 'tiles');

    map.createStaticLayer('water', tileset);
    map.createStaticLayer('rocklevel1', tileset);
    map.createStaticLayer('rocklevel2', tileset);
    map.createStaticLayer('seeweed', tileset);

    this.woman = new Scuba(this, 100, 200, 'woman').setScale(0.75);
    this.scubaOne = new Scuba(this, 200, 200, 'scubaOne').setScale(0.15);
    this.scubaOne.setAngle(-45);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.socket.on('gameCreated', function (gameInfo) {
      const {
        key,
        player,
        score,
        level,
        questions,
        facts,
        taskPositions,
      } = gameInfo;
      this.state.key = key;
      this.state.player = player;
      this.state.score = score;
      this.state.level = level;
      this.state.questions = questions;
      this.state.facts = facts;
      this.state.taskPositions = taskPositions;
    });
  }

  update() {
    this.scubaOne.update(this.cursors);
  }
}

//SET SCREEN SIZE
// var windowWidth = window.innerWidth;
// var widnowHeight = window.innerHeight;
// this.bg = this.add.image(windowWidth / 2, widnowHeight / 2, 'sky');
// this.bg.setDisplaySize(windowWidth, widnowHeight);
