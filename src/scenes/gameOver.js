import Phaser from 'phaser';
import Button from '../objects/Button';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create() {
    const mainMessage = this.add.text(this.game.config.width * 0.5, 128, 'GAME OVER', {
      fontFamily: 'monospace',
      fontSize: 48,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center',
    });
    mainMessage.setOrigin(0.5);
    this.menuButton = new Button(this, this.game.config.width * 0.5,
      200, 'blueButton1', 'blueButton2', 'Save', 'PlayerInput');
    const restartMessage = this.add.text(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      'Reload the page to play again.',
      {
        align: 'center',
        fontSize: 16,
      },
    );
    restartMessage.setOrigin(0.5);
  }
}
