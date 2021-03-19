import phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  constructor(){
    super('MainScene')
  }

  preload() {
    this.load.image('woman', '/assets/woman h1.png')
    this.load.image('tiles', '/assets/ocean-tilesheet.png')
    this.load.tilemapTiledJSON('tilemap', '/assets/big-ocean-level1.json')

}
create(){
  
  this.socket = io();
  this.scene.launch('WaitingRoom', { socket: this.socket})

  const map = this.make.tilemap({ key: 'tilemap' })
  const tileset = map.addTilesetImage('ocean-scene', 'tiles')

  map.createStaticLayer('water', tileset)
  map.createStaticLayer('rocklevel1', tileset)
  map.createStaticLayer('rocklevel2', tileset)
  map.createStaticLayer('seeweed', tileset)

  this.add.image(100, 200, 'woman')

}

  update(){

  }
}

//SET SCREEN SIZE
// var windowWidth = window.innerWidth;
// var widnowHeight = window.innerHeight;
// this.bg = this.add.image(windowWidth / 2, widnowHeight / 2, 'sky');
// this.bg.setDisplaySize(windowWidth, widnowHeight);