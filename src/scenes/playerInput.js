import Phaser from 'phaser';

export default class PlayerInput extends Phaser.Scene {
  constructor() {
    super('PlayerInput');
  }

  create() {

    const text = this.add.text(10, 10, 'Enter your name:', { color: 'white', fontFamily: 'Arial', fontSize: '24px ' });

  }
}