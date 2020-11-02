import 'phaser'

export default class GameScene extends Phaser.Scene {
    constructor(){
        super('Game');
        this.ship;
    }

    preload(){
        this.load.image('space', 'assets/ui/space.png');
		this.load.image('laser', 'assets/ui/projectile1.png');
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
		
		this.LaserGroup = new LaserGroup(this);
        this.addShip();
        this.addEvents();

	}

	// add player
    addShip(){
        const centerX = this.cameras.main.width / 2;
		const bottom = this.cameras.main.height - 90;
		this.player = this.physics.add.sprite(centerX, bottom, 'ship');
	
		this.cursors = this.input.keyboard.createCursorKeys();

		this.player.setCollideWorldBounds(true);
    }

    update(){
    	// enable player to move 4 directions
    	const moveAmt = 200;
    	this.player.setDrag(2000);
    	if(this.cursors.right.isDown){
    		this.player.setVelocityX(moveAmt);
    	}
    	if(this.cursors.left.isDown){
    		this.player.setVelocityX(-moveAmt);
    	}
    	if(this.cursors.up.isDown){
    		this.player.setVelocityY(-moveAmt);
    	}
    	if(this.cursors.down.isDown){
    		this.player.setVelocityY(moveAmt);
    	}
    }
}
