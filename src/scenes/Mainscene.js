import phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  constructor(){
    super('MainScene')
  }

  preload() {
    console.log('hello')
    this.load.image('woman', '/img/woman h1.png')

}
create(){
    this.add.image(100, 200, 'woman')
}

  update(){

  }
}
