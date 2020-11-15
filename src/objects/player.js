import "phaser";
import { GlobalSettings } from "./GlobalSettings";
import LocalStorage from '../objects/localstorage';

const initialX = GlobalSettings.width / 2;
const initialY = GlobalSettings.height - 50;

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, initialX, initialY, "player1", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    this.lives = 5;
    this.score = 0;

    this.createAnimations();
    this.anims.play("fly");
  }

  createAnimations() {
    this.scene.anims.create({
      key: "fly",
      frames: [{ key: "player1", frame: 0 }, { key: "player1", frame: 1 }, { key: "player1", frame: 2 }],
      frameRate: 30,
      repeat: -1
    });
    this.scene.anims.create({
      key: "ghost",
      frames: [
        { key: "player1", frame: 3 },
        { key: "player1", frame: 0 },
        { key: "player1", frame: 3 },
        { key: "player1", frame: 1 }
      ],
      frameRate: 20,
      repeat: 5
    });
  }

  handleCollision() {
    this.lives -= 1;
    this.scene.sound.add("player-explosion").play();
    this.scene.updateGUI();
    if (this.lives < 1) {
      this.scene.gameOver();
      this.destroy();
      return;
    }
    this.x = initialX;
    this.y = initialY;
    this.on(`${Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE}ghost`, () => {
      this.anims.play("fly");
    });

    this.anims.play("ghost");
  }

  addToScore(points = 0) {
    if (this.active) {
      this.score += points;
      this.scene.updateGUI();
      LocalStorage.saveLocalStorage(this.score);
    }
  }

  update(_, delta) {
    this.setVelocity(0);
    this.shotDeltaTime += delta;

    if (this.scene.keys.right.isDown || this.scene.keys.D.isDown) {
      this.body.velocity.x += 300;
    }
    if (this.scene.keys.left.isDown || this.scene.keys.A.isDown) {
      this.body.velocity.x -= 300;
    }
    if (this.scene.keys.up.isDown || this.scene.keys.W.isDown) {
      this.body.velocity.y -= 300;
    }
    if (this.scene.keys.down.isDown || this.scene.keys.S.isDown) {
      this.body.velocity.y += 300;
    }
  }
}
