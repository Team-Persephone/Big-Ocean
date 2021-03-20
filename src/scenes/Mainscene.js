import phaser from "phaser";

import Scuba from "../entities/Scuba";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.state = {
      key: "",
      player: {},
      score: {},
      level: 1,
      questions: [],
      facts: [],
      taskPositions: {},
    };
  }

  preload() {
    this.load.spritesheet("scubaPink", "/assets/scuba_divers/scubaPink.png", {
      frameWidth: 820,
      frameHeight: 420,
    });
    this.load.spritesheet("scubaGreen", "/assets/scuba_divers/scubaGreen.png", {
      frameWidth: 820,
      frameHeight: 420,
    });

    this.load.image("tiles", "/assets/ocean-tilesheet.png");
    this.load.tilemapTiledJSON("tilemap", "/assets/big-ocean-level1.json");
  }
  createAnimations() {
    this.anims.create({
      key: "swimm",
      frames: this.anims.generateFrameNumbers("scubaGreen", {
        start: 5,
        end: 9,
      }),
      frameRate: 5,
      repeat: -1,
    });
  }
  create() {
    this.socket = io();
    this.scene.launch("WaitingRoom", { socket: this.socket });

    const map = this.make.tilemap({ key: "tilemap" });
    const tileset = map.addTilesetImage("ocean-scene", "tiles");

    map.createStaticLayer("water", tileset);
    map.createStaticLayer("rocklevel1", tileset);
    map.createStaticLayer("rocklevel2", tileset);
    map.createStaticLayer("seeweed", tileset);

    this.scubaPink = new Scuba(this, 100, 300, "scubaPink").setScale(0.2);
    this.scubaGreen = new Scuba(this, 200, 200, "scubaGreen").setScale(0.2);
    this.scubaGreen.setAngle(-45);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.createAnimations();
    const state = this.state;

    const addUrl = (gameKey) => {
      const url = `http://localhost:3000/${gameKey}`
      const link = this.add.text(100, 100, url)
      link.setInteractive();

      link.on('pointerdown', () => {
        navigator.clipboard.writeText(url);
        link.setText('copied!')
        // let s = window.open(url, '_blank')
        // if(s && s.focus) s.focus()
        // else if (!s) window.location.href = url
      })
    }
    this.socket.on("gameCreated", function (gameInfo) {
      const {
        key,
        player,
        score,
        level,
        questions,
        facts,
        taskPositions,
      } = gameInfo;
      console.log(gameInfo)
      state.key = key;
      state.player = player;
      state.score = score;
      state.level = level;
      state.questions = questions;
      state.facts = facts;
      state.taskPositions = taskPositions;

      addUrl(state.key)
    });
  }

  update() {
    this.scubaGreen.update(this.cursors);
  }
}

//SET SCREEN SIZE
// var windowWidth = window.innerWidth;
// var widnowHeight = window.innerHeight;
// this.bg = this.add.image(windowWidth / 2, widnowHeight / 2, 'sky');
// this.bg.setDisplaySize(windowWidth, widnowHeight);
