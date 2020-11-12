import Button from '../objects/Button';
import GlobalSettings from '../objects/GlobalSettings';
import GameScene from './gameScene';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create(currentScene) {

    const mainMessage = this.add.text(window.innerWidth * 0.8 / 2, window.innerHeight * 0.8 / 2 - 30, "GAME OVER", {
      align: "center",
      fontSize: 32
    });
    mainMessage.setOrigin(0.5);
    this.menuButton = new Button(this, window.innerWidth * 0.8 / 2, window.innerHeight * 0.8 / 2, 'blueButton1', 'blueButton2', 'PlayerInput', 'PlayerInput');
    // const finalScore = this.add.text(
      // window.innerWidth * 0.8 / 2,
      // window.innerHeight * 0.8 / 2,
    //   `Your final score was ${this.gameScene.player.score}.`,
    //   {
    //     align: "center",
    //     fontSize: 16
    //   }
    // );
    // finalScore.setOrigin(0.5);

    const restartMessage = this.add.text(
      window.innerWidth * 0.8 / 2,
      window.innerHeight * 0.8 / 2 + 20,
      `Reload the page to play again.`,
      {
        align: "center",
        fontSize: 16
      }
    );
    restartMessage.setOrigin(0.5);
  }
}
