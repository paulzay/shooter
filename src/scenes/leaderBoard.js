import Phaser from 'phaser';
import Button from '../objects/Button';
import { getScores } from './apicall';

export default class LeaderBoard extends Phaser.Scene {
  constructor() {
    super('LeaderBoard');
  }

  create() {
    this.cameras.main.setBackgroundColor('#000111');
    getScores().then((scores) => {
      scores.sort((a, b) => b.score - a.score);
      this.add.text(100, 20, 'RANK  SCORE   NAME');
      for (let i = 0; i < 5; i += 1) {
        this.add.text(100, 90 * (i + 1), ` ${i + 1}     ${scores[i].score}   ${scores[i].user}`);
      }
    }).catch(() => {

    });
  }

}