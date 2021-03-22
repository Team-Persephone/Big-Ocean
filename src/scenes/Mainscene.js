import phaser from 'phaser';

import Scuba from '../entities/Scuba';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.state = {
      key: '',
      players: {},
      score: {},
      level: 1,
      questions: [],
      facts: [],
      taskPositions: {},
    };
  }

  preload() {

    this.load.spritesheet('scubaPink', '/assets/scuba_divers/scubaPink.png', {
      frameWidth: 820,
      frameHeight: 420,
    });
    this.load.spritesheet('scubaGreen', '/assets/scuba_divers/scubaGreen.png', {
      frameWidth: 820,
      frameHeight: 420,
    });
    this.load.spritesheet('scubaPurple','/assets/scuba_divers/scubaPurple.png', {
        frameWidth: 820,
        frameHeight: 420,
      }
    );

    this.load.image('tiles', '/assets/ocean-tilesheet.png');
    this.load.tilemapTiledJSON('tilemap', '/assets/big-ocean-level1.json');

    //Audio
    this.load.audio('music', ['/audio/Waiting_Room.mp3']);
  }
  createPlayer (player) {
    this[player.avatar] = new Scuba(this, 100, 200, `${player.avatar}`).setScale(0.2);
        this[player.avatar].setAngle(-45);
        //scuba can't leave the screne
        this[player.avatar].body.collideWorldBounds = true;
  }

  createAnimations(avatar) {
    this.anims.create({
      key: 'swim',
      frames: this.anims.generateFrameNumbers(avatar, {
        start: 5,
        end: 9,
      }),
      frameRate: 5,
      repeat: -1,
    });
  }

  create() {
    this.music = this.sound.add('music', {
      volume: 0.5,
      loop: true,
    });
    this.music.play();

    this.socket = io();
    this.scene.launch('WaitingRoom', { socket: this.socket });

    const map = this.make.tilemap({ key: 'tilemap' });
    const tileset = map.addTilesetImage('ocean-scene', 'tiles');

    map.createStaticLayer('water', tileset);
    map.createStaticLayer('rocklevel1', tileset);
    map.createStaticLayer('rocklevel2', tileset);
    map.createStaticLayer('seeweed', tileset);

    //creating movement and navitagion for scuba divers
    this.cursors = this.input.keyboard.createCursorKeys();
    // this.createAnimations();

    const addUrl = (gameKey) => {
      const url = `http://localhost:3000/${gameKey}`;
      const link = this.add.text(100, 100, url);
      link.setInteractive();

      link.on('pointerdown', () => {
        navigator.clipboard.writeText(url);
        link.setText('copied!');
        // let s = window.open(url, '_blank')
        // if(s && s.focus) s.focus()
        // else if (!s) window.location.href = url
      });
    };
    this.socket.on('gameCreated', ({gameInfo, socketId}) => {
      const {
        key,
        players,
        avatars,
        score,
        level,
        questions,
        facts,
        taskPositions,
      } = gameInfo;

      this.state.key = key;
      this.state.players = players;
      this.state.avatars = avatars;
      this.state.score = score;
      this.state.level = level;
      this.state.questions = questions;
      this.state.facts = facts;
      this.state.taskPositions = taskPositions;

      console.log(this.state);

      //Volume - add volume sound bar for display here

      addUrl(key);
      this.createPlayer(gameInfo.players[socketId])
    });

    //letting everyone in the game know someone has joined
    this.socket.on('joinedGame', ({newPlayer, allPlayers}) => {
      console.log('joinInfo -->', newPlayer);
      console.log('joinedGame allPlayers --->', allPlayers)
      this.state.players = allPlayers;
      for(let player in this.state.players) {
        if(this.state.players[player].avatar !== newPlayer.avatar){
       //here we want to add existing player to scene
        console.log('this is another player', this.state.players[player].avatar)
        } else {
          this.createPlayer(newPlayer)
        }
      }

      // console.log(`${playerId} joined game`);
    });
  }

  update() {
    // console.log('obj.values -->', Object.values(this.state.players));
    //this.scubaGreen.update(this.cursors)
    // Object.values(this.state.players).forEach( player => {
    //   [player.avatar].update(this.cursors);
    // })
    

    // socket.emit('playerMoved')...

  }
}

//SET SCREEN SIZE
// var windowWidth = window.innerWidth;
// var widnowHeight = window.innerHeight;
// this.bg = this.add.image(windowWidth / 2, widnowHeight / 2, 'sky');
// this.bg.setDisplaySize(windowWidth, widnowHeight);
