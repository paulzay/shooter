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
    this.load.image("bullets", 'assets/asets/enemy-bullet.png');
    this.load.image('torpedo','assets/ui/torpedo.png')
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
    this.createAnimation();

    this.physics.add.overlap(this.enemies, this.laserGroup, (enemy, bullet) => {
      this.handleEnemyAndPlayerBulletCollision(enemy, bullet);
    });

    this.physics.add.overlap(this.player, this.enemyBullets, (player, bullet) => {
      this.handlePlayerAndEnemieBulletsCollision(player, bullet);
    });
    
	}

	update(elapsedTime, deltaTime){
    this.checkStageStatus();
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

  createAnimation() {
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

    // Regular enemy animations
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
    if (this.player.score > 1500 && !(this.boss instanceof EnemyBoss)) {
      this.spawnBoss();
    } 
  }
}


class EnemyShooter extends Enemy {
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y, "shooting-enemy");

    const vX = Phaser.Math.Between(-25, 25);
    const vY = Phaser.Math.Between(20, 25);

    const rad = Math.atan2(-vX, vY);
    this.setVelocity(vX, vY);
    this.setRotation(rad);
    this.bulletDelta = 0;
    this.bullets = this.scene.enemyBullets;
    this.health = GlobalSettings.enemyShooterHealth;
    this.reward = GlobalSettings.enemyShooterReward;
    this.dropRate = GlobalSettings.enemyShooterDropRate;
  }

  update(_, deltaTime) {
    this.bulletDelta += deltaTime;

    if (this.bulletDelta > GlobalSettings.enemyShooterBulletDelay) {
      this.bulletDelta = 0;
      this.fireBullet();
    }
  }
  fireBullet() {
    let bullet = this.scene.physics.add.image(this.x, this.y, "bullets");
 
    // Make it so the bullet moves towards the player current position at a speed of 50 on both axis;
    this.scene.physics.moveTo(bullet, this.scene.player.x, this.scene.player.y, 40);
    // Add the bullet to the enemyBullets group so we can do collision checking with it.
    this.bullets.add(bullet);
  }
}

class EnemyBoss extends Enemy {
  constructor(scene) {
    super(scene, GlobalSettings.width / 2, 0, "boss");

    this.bulletDelta = 0;
    this.bullets = this.scene.enemyBullets;
    this.isInvincible = true;
    this.health = GlobalSettings.enemyBossHealth;
    this.reward = GlobalSettings.enemyBossReward;
    this.dropRate = GlobalSettings.enemyBossDropRate;
    // Allow bouncing off world bounds
    this.setScale(0.75);
    this.playAnimation("enemyBoss_ghost");
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      duration: 2000,
      onComplete: () => {
        this.anims.play("enemyBoss_fly");
        this.isInvincible = false;
        this.setVelocityX(100);
      }
    });
    this.body.bounce.x = 1;
    this.body.collideWorldBounds = true;
  }

  update(_, deltaTime) {
    this.bulletDelta += deltaTime;

    if (this.bulletDelta > GlobalSettings.enemyBossBulletDelay) {
      this.bulletDelta = 0;
      this.fireBullet();
    }
  }

  handleCollision() {
    // If boss stills in invincible mode, do not deal damage.
    if (this.isInvincible) {
      return;
    }

    this.health -= 1;
    if (this.health < 1) {
      const explosion = this.scene.add.sprite(this.x, this.y, "explosion", 0);
      this.scene.sound.add("explosion").play();
      this.destroy();
      explosion.on(`${Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE}explode`, () => {
        explosion.destroy();
      });
      explosion.anims.play("explode");
    }
  }
  fireBullet() {
    // First shooting pattern
    if (this.health >= GlobalSettings.enemyBossHealth / 2) {
      // Create centre bullet
      let bullet = this.scene.physics.add.image(this.x, this.y + 32, "bullets");
      this.scene.physics.moveTo(bullet, this.scene.player.x, this.scene.player.y, 100);
      this.bullets.add(bullet);
      Array.from({ length: 3 }).forEach((_, i) => {
        // Left hand side bullets
        let bulletLeft = this.scene.physics.add.image(this.x - 20 * (i + 1), this.y + 32, "bullets");
        this.scene.physics.moveTo(bulletLeft, this.scene.player.x, this.scene.player.y, 100);
        this.bullets.add(bulletLeft);
        // Right hand side bullets
        let bulletRight = this.scene.physics.add.image(this.x + 20 * (i + 1), this.y + 32, "bullets");
        this.scene.physics.moveTo(bulletRight, this.scene.player.x, this.scene.player.y, 100);
        this.bullets.add(bulletRight);
      });
    } else {
      // Second shooting pattern
      const bullet = this.scene.physics.add.image(this.x, this.y + 32, "bullets");
      bullet.setVelocity(0, 200);
      this.bullets.add(bullet);
      Array.from({ length: 3 }).forEach((_, i) => {
        // Left hand side bullets
        const bulletLeft = this.scene.physics.add.image(this.x, this.y + 32, "bullets");
        const theta = -270 - (i + 1) * 10;
        this.scene.physics.velocityFromAngle(theta, 200, bulletLeft.body.velocity);
        this.bullets.add(bulletLeft);
        // Right hand side bullets
        const bulletRight = this.scene.physics.add.image(this.x, this.y + 32, "bullets");
        const ro = -270 + (i + 1) * 10;
        this.scene.physics.velocityFromAngle(ro, 200, bulletRight.body.velocity);
        this.bullets.add(bulletRight);
      });
    }
  }
}