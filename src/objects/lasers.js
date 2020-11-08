import 'phaser';

export class Laser extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y) {
		super(scene, x, y, 'laser');
	}

	fire(x, y) {
		this.body.reset(x, y);

		this.setActive(true);
		this.setVisible(true);

		this.setVelocityY(-900);
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
 
		if (this.y <= 0) {
			this.setActive(false);
			this.setVisible(false);
		}
	}

}

export class LaserGroup extends Phaser.Physics.Arcade.Group
{
	constructor(scene) {
		super(scene.physics.world, scene);

		this.createMultiple({
			frameQuantity: 30,
			key: 'laser',
			active: false,
			visible: false,
			classType: Laser
		});
	}

	fireBullet(x, y) {
		const laser = this.getFirstDead(false);

		if(laser) {
			laser.fire(x, y);
			laser.setScale(0.3)
		}
	}
}

// import Entity from './entities';

// export class EnemyLaser extends Entity {
//   constructor(scene, x, y) {
//     super(scene, x, y, "bullets");
//     this.body.velocity.y = 200;
//   }
// }

// export class Bullet extends Phaser.Sprite {

//     constructor({ game, x, y, asset, health, tint = 0xff0000 }) {
//         super(game, x, y, asset);

//         this.anchor.setTo(0.5);
//         this.scale.setTo(0.8);
//         this.health = health;
//         this.tint = tint;
//         this.checkWorldBounds = true;
//         this.outOfBoundsKill = true;
//     }
// }