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
    // this.load.image("bullets", 'assets/asets/enemy-bullet.png');
    // this.load.image('torpedo','assets/ui/torpedo.png')
    this.load.spritesheet("enemy", 'assets/asets/enemy.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create(){
		this.add.image(400,300, 'space');
		this.player = new Player(this);
		this.laserGroup = new LaserGroup(this);
    this.addEvents();
    this.textLives = this.add.text(10, 10, `Lives: ${this.player.lives}`);
    this.textScore = this.add.text(100, 10, `Score: ${this.player.score}`);
    //player movement
    this.keys = this.input.keyboard.createCursorKeys(); 
    this.keys.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.enemies = this.add.group();
    this.enemyBullets = this.add.group();
    this.enemyDelta = 0;
    this.enemyShooterDelta = 0;
	}

	update(elapsedTime, deltaTime){

    this.enemyDelta += deltaTime;
    this.enemyShooterDelta += deltaTime;

    if (this.player && this.player.active) {
      this.player.update(elapsedTime, deltaTime);
    }
		this.inputKeys.forEach(key => {
			if(Phaser.Input.Keyboard.JustDown(key)) {
				this.fireBullet();
			}
    });
    
    // Spawn regular enemy
    if (elapsedTime > 3 && this.enemyDelta > GlobalSettings.enemySpawnDelay) {
      this.enemyDelta = 0;
      this.spawnEnemy();
    }

    this.enemies.getChildren().forEach(enemy => {
      enemy.update(elapsedTime, deltaTime);
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
		this.laserGroup.fireBullet(this.player.x, this.player.y - 20);
  }
  updateGUI() {
    this.textLives.text = `Lives: ${this.player.lives}`;
    this.textScore.text = `Score: ${this.player.score}`;
  }

  spawnEnemy() {
    const enemy = new Enemy(
                this,
                Phaser.Math.Between(0, this.game.config.width),
                0
            );
    enemy.playAnimation("enemy_fly");
    this.enemies.add(enemy);
  }
}
