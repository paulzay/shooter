import 'phaser';
import LaserGroup from '../objects/lasers';
import { GlobalSettings } from "../objects/GlobalSettings";
import Player from '../objects/player';
import Enemy from '../objects/Enemy';

const initialX = GlobalSettings.width / 2;
const initialY = GlobalSettings.height - 50;

export default class GameScene extends Phaser.Scene {
  constructor(){
    super('Game');
		this.ship;
		this.laserGroup;
		this.inputKeys;
  }

  preload(){
    this.load.image('space', 'assets/ui/space.png');
    this.load.spritesheet("player1", 'assets/asets/player1.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.image("bullet", 'assets/ui/laser.png');
  }

  create(){
		this.add.image(400,300, 'space');
		this.player = new Player(this);
		this.laserGroup = new LaserGroup(this);
		this.addEvents();
	}

	update() {

		this.inputKeys.forEach(key => {
			if(Phaser.Input.Keyboard.JustDown(key)) {
				this.fireBullet();
			}
		});
	}
    
  addEvents(){

		// Firing bullets should also work on enter / spacebar press
		this.inputKeys = [
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
		];
    }

	fireBullet() {
		this.laserGroup.fireBullet(this.ship.x, this.ship.y - 20);
	}
}
