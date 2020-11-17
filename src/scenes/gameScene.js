import 'phaser';
import { GlobalSettings } from "../objects/GlobalSettings";
import Player from '../objects/player';
import Enemy from '../objects/Enemy';
import EnemyBoss from '../objects/enemyBoss';
import EnemyShooter from '../objects/enemyShooter';
import config from '../config/config';

const initialX = GlobalSettings.width / 2;
const initialY = GlobalSettings.height - 50;

export default class GameScene extends Phaser.Scene {
  constructor(){
    super('Game');
		this.ship;
		this.inputKeys;
  }

  preload(){
    this.load.image("background", "assets/ui/background.png");
    this.load.spritesheet("player1", 'assets/asets/player1.png', {
      frameWidth: 64,
      
      frameHeight: 64
    });
    this.load.image("bullet", 'assets/ui/laser.png');
    this.load.image("bullets", 'assets/asets/enemy-bullet.png');
    this.load.spritesheet("enemy", 'assets/asets/enemy.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("shooting-enemy", 'assets/asets/shooting-enemy.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("explosion", 'assets/asets//explosion.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("boss", 'assets/asets/boss.png', {
      frameWidth: 93,
      frameHeight: 75
    });
    this.load.audio("player-fire", [
      'assets/asets//player-fire.ogg',
      'assets/asets//player-fire.wav'
    ]);
    this.load.audio("player-explosion", [
      'assets/asets/player-explosion.ogg',
      'assets/asets//player-explosion.wav'
    ]);
    this.load.audio("explosion", [
      'assets/asets/explosion.ogg',
      'assets/asets//explosion.wav'
    ]);
    this.load.audio("enemy-fire", [
      'assets/asets/enemy-fire.ogg',
      'assets/asets/enemy-fire.wav'
    ]);
  }

  create(){
    this.background = this.add.tileSprite(0, 0,config.width, config.height, "background");
    this.background.setOrigin(0, 0);
    this.background.setScale(3.2);

		this.player = new Player(this);
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
    this.playerBullets = this.add.group();
    this.bossDefeated = false;
    this.boss = null;
      // Add explosion animation
    this.anims.create({
      key: "explode",
      frames: [
        { key: "explosion", frame: 0 },
        { key: "explosion", frame: 1 },
        { key: "explosion", frame: 2 },
        { key: "explosion", frame: 3 },
        { key: "explosion", frame: 4 },
        { key: "explosion", frame: 5 }
      ],
      frameRate: 15,
      repeat: 0,
      hideOnComplete: true
    });

    this.anims.create({
      key: "enemy_fly",
      frames: [{ key: "enemy", frame: 0 }, { key: "enemy", frame: 1 }, { key: "enemy", frame: 2 }],
      frameRate: 30,
      repeat: -1
    });

    this.anims.create({
      key: "enemy_ghost",
      frames: [
        { key: "enemy", frame: 3 },
        { key: "enemy", frame: 0 },
        { key: "enemy", frame: 3 },
        { key: "enemy", frame: 1 }
      ],
      frameRate: 20,
      repeat: 1
    });
    // Shooter enemy animations
    this.anims.create({
      key: "enemyShooter_fly",
      frames: [
        { key: "shooting-enemy", frame: 0 },
        { key: "shooting-enemy", frame: 1 },
        { key: "shooting-enemy", frame: 2 }
      ],
      frameRate: 30,
      repeat: -1
    });

    this.anims.create({
      key: "enemyShooter_ghost",
      frames: [
        { key: "shooting-enemy", frame: 3 },
        { key: "shooting-enemy", frame: 0 },
        { key: "shooting-enemy", frame: 3 },
        { key: "shooting-enemy", frame: 1 }
      ],
      frameRate: 20,
      repeat: 1
    });

    // Boss animations
    this.anims.create({
      key: "enemyBoss_fly",
      frames: [{ key: "boss", frame: 0 }, { key: "boss", frame: 1 }, { key: "boss", frame: 2 }],
      frameRate: 30,
      repeat: -1
    });

    this.anims.create({
      key: "enemyBoss_ghost",
      frames: [
        { key: "boss", frame: 3 },
        { key: "boss", frame: 0 },
        { key: "boss", frame: 3 },
        { key: "boss", frame: 1 }
      ],
      frameRate: 20,
      repeat: -1
    });

    this.physics.add.overlap(this.enemies, this.playerBullets, (enemy, bullet) => {
      this.handleEnemyAndPlayerBulletCollision(enemy, bullet);
    });

    this.physics.add.overlap(this.player, this.enemyBullets, (player, bullet) => {
      this.handlePlayerAndEnemieBulletsCollision(player, bullet);
    });
    this.cleanupArtifacts();
    
	}
 
	update(elapsedTime, deltaTime){
    this.background.tilePositionY -= 0.5;
    this.checkStageStatus();
    this.enemyDelta += deltaTime;
    this.enemyShooterDelta += deltaTime;

    if (this.player && this.player.active) {
      this.player.update(elapsedTime, deltaTime);
    }
		this.inputKeys.forEach(key => {
			if(Phaser.Input.Keyboard.JustDown(key)) {
				this.player.fireBullet();
			}
    });
    
    // Spawn regular enemy
    if (elapsedTime > 3 && this.enemyDelta > GlobalSettings.enemySpawnDelay) {
      this.enemyDelta = 0;
      this.spawnEnemy();
    }
    // Spawn shooter enemy
    if (
      elapsedTime > 3 &&
      this.enemyShooterDelta > GlobalSettings.enemyShooterSpawnDelay &&
      !(this.boss instanceof EnemyBoss)
    ) {
      this.enemyShooterDelta = 0;
      this.spawnEnemyShooter();
    }
    this.enemies.getChildren().forEach(enemy => {
      enemy.update(elapsedTime, deltaTime);
    });
	}
  cleanupArtifacts() {
    this.enemyBullets.getChildren().forEach(bullet => {
      if (!Phaser.Geom.Rectangle.Overlaps(this.physics.world.bounds, bullet.getBounds())) {
        bullet.destroy();
      }
    });

    this.playerBullets.getChildren().forEach(bullet => {
      if (!Phaser.Geom.Rectangle.Overlaps(this.physics.world.bounds, bullet.getBounds())) {
        bullet.destroy();
      }
    });
  }  
  addEvents(){
		this.inputKeys = [
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
		];
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
  spawnEnemyShooter() {
    const enemy = new EnemyShooter(
        this,
        Phaser.Math.Between(0, this.game.config.width),
        0
    );
    enemy.playAnimation("enemyShooter_fly");
    this.enemies.add(enemy);
  }

  spawnBoss() {
    this.boss = new EnemyBoss(
                this,
                Phaser.Math.Between(0, this.game.config.width),
                0
            );
    this.enemies.add(this.boss);
  }

  handlePlayerAndEnemieBulletsCollision(player, bullet) {
    bullet.destroy();
    player.handleCollision();
  }

  handleEnemyAndPlayerBulletCollision(enemy, bullet) {
    bullet.destroy();
    enemy.handleCollision();
    if (!enemy.active) {
      this.player.addToScore(enemy.reward);
    }
  }
  
  gameOver(){
    this.scene.start('GameOver');
  }
  checkStageStatus() {
    if (this.player.score > 5000 && !(this.boss instanceof EnemyBoss)) {
      this.spawnBoss();
    } else if (this.boss instanceof EnemyBoss && this.boss.health < 1){
      this.gameOver();
      this.boss.destroy();
      return;
    }
  }
}
