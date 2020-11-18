import Phaser from 'phaser';
import Enemy from './Enemy';
import { GlobalSettings } from './GlobalSettings';

export default class EnemyShooter extends Enemy {
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y, 'shooting-enemy');

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
    const bullet = this.scene.physics.add.image(this.x, this.y, 'bullets');
    this.scene.physics.moveTo(bullet, this.scene.player.x, this.scene.player.y, 40);
    this.bullets.add(bullet);
  }
}