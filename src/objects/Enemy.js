import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x = 0, y = 0, sprite = 'enemy') {
    super(scene, x, y, sprite, 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setVelocity(0, 25);
    this.health = 1;
    this.reward = 100;
    this.dropRate = 0.3;
  }

  update() {
    if (!Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, this.getBounds())) {
      this.destroy();
    }
  }

  handleCollision() {
    this.health -= 1;
    if (this.health < 1) {
      const explosion = this.scene.add.sprite(this.x, this.y, 'explosion', 0);
      this.scene.sound.add('explosion').play();
      this.destroy();
      explosion.on(`${Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE}explode`, () => {
        explosion.destroy();
      });
      explosion.anims.play('explode');
    }
  }

  playAnimation(name = '') {
    this.anims.play(name);
  }
}
