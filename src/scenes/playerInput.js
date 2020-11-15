import Phaser from 'phaser';
import  LocalStorage from '../objects/localstorage';
import { getScores, postScores }from './apicall';


export default class PlayerInput extends Phaser.Scene {
  constructor() {
    super('PlayerInput');
  }

  preload(){
    this.load.html('nameform', 'assets/text/nameform.html');
  }
  create() {
    const score = LocalStorage.readLocalStorage();
    LocalStorage.clearLocalStorage();
    const div = this.add
      .dom(this.game.config.width * 0.5, this.game.config.height * 0.24)
      .createFromCache('nameform');
    this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.input.keyboard.removeCapture(Phaser.Input.Keyboard.KeyCodes.W);
    this.input.keyboard.removeCapture(Phaser.Input.Keyboard.KeyCodes.S);
    this.input.keyboard.removeCapture(Phaser.Input.Keyboard.KeyCodes.A);
    this.input.keyboard.removeCapture(Phaser.Input.Keyboard.KeyCodes.D);

    this.returnKey.on("down", event => {
        let inputName = document.getElementById('nameinput').value;
        if(inputName!= "" && score > 0) {
          postScores(inputName);
          this.scene.start('LeaderBoard');
        }
    });
    
    this.score = this.add.text(this.game.config.width * 0.3, 360, `Your Score is: ${score}`, {
      fontFamily: 'monospace',
      fontSize: 20,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center',
    });
  }
}