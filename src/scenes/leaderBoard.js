import Phaser from 'phaser';
import { getScores } from '../objects/apicall';
import Button from '../objects/Button';
import config from '../config/config';

export default class LeaderBoard extends Phaser.Scene {
  constructor() {
    super('LeaderBoard');
  }

  create() {
    getScores().then((scores) => {
      this.add.text(100, 20, 'RANK  SCORE   NAME');
      for (let i = 0; i < 10; i += 1) {
        this.add.text(100, 90 * (i + 1), ` ${i + 1}     ${scores[i].score}   ${scores[i].user}`);
      }
    }).catch(() => {

    });
    this.menuButton = new Button(this, config.width / 2, config.height / 2 + 250, 'blueButton1', 'blueButton2', 'Menu', 'Title');
  }
}