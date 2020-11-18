import Phaser from 'phaser';
import config from '../config/config';
import Button from '../objects/Button';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    this.title = this.add.text(this, config.width / 2, config.height / 2 - 150,
      'STRIKE BACK', {
        fontFamily: 'monospace',
        fontSize: 48,
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center',
      });
    this.title.setOrigin(0.5);

    // Game
    this.gameButton = new Button(this, config.width / 2, config.height / 2 - 100,
      'blueButton1', 'blueButton2', 'Play', 'Game');

    // Options
    this.optionsButton = new Button(this, config.width / 2, config.height / 2,
      'blueButton1', 'blueButton2', 'Options', 'Options');

    // Credits
    this.creditsButton = new Button(this, config.width / 2, config.height / 2 + 100,
      'blueButton1', 'blueButton2', 'Credits', 'Credits');

    this.scoreButton = new Button(this, config.width / 2, config.height / 2 + 200,
      'blueButton1', 'blueButton2', 'Score', 'LeaderBoard');

    this.model = this.sys.game.globals.model;
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.bgMusic = this.sound.add('menuMusic', { volume: 0.5, loop: true });
      this.bgMusic.play();
      this.model.bgMusicPlaying = true;
      this.sys.game.globals.bgMusic = this.bgMusic;
    }
  }

  centerButton(gameObject, offset = 0) {
    Phaser.Display.Align.In.Center(
      gameObject,
      this.add.zone(config.width / 2, config.height / 2 - offset * 100,
        config.width, config.height),
    );
  }

  /* eslint-disable class-methods-use-this */
  centerButtonText(gameText, gameButton) {
    Phaser.Display.Align.In.Center(
      gameText,
      gameButton,
    );
  }
}
