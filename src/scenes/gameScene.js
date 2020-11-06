import 'phaser'

export default class GameScene extends Phaser.Scene {
    constructor(){
        super('Game');
		this.ship;
		this.laserGroup;
		this.inputKeys;
		this.score = 0;
		this.scoreString = '';
		this.scoreText;
		this.lives;
    }

    preload(){
        this.load.image('space', 'assets/ui/space.png');
		this.load.image('laser', 'assets/ui/projectile2.png');
		this.load.image('ship', 'assets/ui/starship.png');
		this.load.spritesheet('foe1', 'assets/ui/starshipdark.png', {
        frameWidth: 16,
        frameHeight: 16
		});
		this.load.image('foe2','assets/ui/ufo.png')
		this.load.spritesheet('boss','assets/ui/ufodark.png', {
        frameWidth: 32,
        frameHeight: 32
		})
		this.load.image('asteroid1','assets/ui/asteroid1_brown.png')
		this.load.image('asteroid2','assets/ui/asteroid1_grey.png')
		this.load.image('asteroid3','assets/ui/asteroid2_brown.png')
		this.load.image('asteroid4','assets/ui/asteroid2_grey.png')
		this.load.image('torpedo','assets/ui/torpedo.png')
		this.load.image('torpedodark','assets/ui/torpedodark.png')

    }

    create(){
		this.add.image(400,300, 'space');
		
		this.laserGroup = new LaserGroup(this);

		this.addShip();
		this.addEvents();
        // this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

	    //  The score
	    this.scoreString = 'Score : ';
	    this.scoreText = this.add.text(10, 10, this.scoreString + this.score, { font: '34px', fill: '#fff' });

	    //  Lives
	    this.lives = this.add.group();
	    this.add.text(this.cameras.main.width - 100, 10, 'Lives : ', { font: '34px', fill: '#fff' });

	    for (var i = 0; i < 3; i++) 
	    {
	        this.ships = this.lives.create(this.cameras.main.width - 100 + (30 * i), 60, 'ship');
	        this.ships.setAnchor =0.5, 0.5;
	        this.ships.angle = 90;
	        this.ships.scale = 0.1;
	        this.ships.alpha = 0.4;
	    }


	}

	// add player
    addShip(){
        const centerX = this.cameras.main.width / 2;
		const bottom = this.cameras.main.height - 90;
		this.ship = this.physics.add.sprite(centerX, bottom, 'ship');
		this.ship.scale = 0.15;
		this.cursors = this.input.keyboard.createCursorKeys();

		this.ship.setCollideWorldBounds(true);
    }

	update() {
		// Loop over all keys
		this.inputKeys.forEach(key => {
			// Check if the key was just pressed, and if so -> fire the bullet
			if(Phaser.Input.Keyboard.JustDown(key)) {
				this.fireBullet();
			}
		});
    	const moveAmt = 200;
    	this.ship.setDrag(2000);
    	if(this.cursors.right.isDown){
    		this.ship.setVelocityX(moveAmt);
    	}
    	if(this.cursors.left.isDown){
    		this.ship.setVelocityX(-moveAmt);
    	}
    	if(this.cursors.up.isDown){
    		this.ship.setVelocityY(-moveAmt);
    	}
    	if(this.cursors.down.isDown){
    		this.ship.setVelocityY(moveAmt);
    	}
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

class Laser extends Phaser.Physics.Arcade.Sprite
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

class LaserGroup extends Phaser.Physics.Arcade.Group
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