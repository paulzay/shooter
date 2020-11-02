import 'phaser'

export default class GameScene extends Phaser.Scene {
    constructor(){
        super('Game');
    }

    preload(){
        this.load.image('space', 'assets/spacessets/space.svg');
		this.load.image('laser', 'assets/spacessets/projectile1.svg');
		this.load.spritesheet("ship","assets/spacessets/starship.svg", {
        frameWidth: 16,
        frameHeight: 16
		});
		this.load.spritesheet('foe1', 'assets/spacessets/starshipdark.svg', {
        frameWidth: 16,
        frameHeight: 16
		});
		this.load.image('foe2','assets/spacessets/ufo.svg')
		this.load.spritesheet('boss','assets/spacessets/ufodark.svg', {
        frameWidth: 16,
        frameHeight: 16
		})
		this.load.image('asteroid1','assets/spacessets/asteroid1_brown.svg')
		this.load.image('asteroid2','assets/spacessets/asteroid1_grey.svg')
		this.load.image('asteroid3','assets/spacessets/asteroid2_brown.svg')
		this.load.image('asteroid4','assets/spacessets/asteroid2_grey.svg')
		this.load.image('torpedo','assets/spacessets/torpedo.svg')
		this.load.image('torpedodark','assets/spacessets/torpedodark.svg')

    }

    create(){
		this.add.image(400,300, 'space');

	}
}