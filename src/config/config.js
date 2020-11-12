import 'phaser';

const ratio = Math.max(window.innerWidth / window.innerHeight, window.innerHeight / window.innerWidth)
const DEFAULT_HEIGHT = 720 
const DEFAULT_WIDTH = ratio * DEFAULT_HEIGHT

export default {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    //make it fullscreen/centered
  // scale: {
  //   mode: Phaser.Scale.FIT,
  //   autoCenter: Phaser.Scale.CENTER_BOTH,
  //   width: DEFAULT_WIDTH,
  //   height: DEFAULT_HEIGHT
  // },

	width: 800,
    height: 600,
	physics: {
		default: "arcade",
		arcade: {
		gravity: { x: 0, y: 0 }
		}
	},
	pixelArt: true,
	roundPixels: true
};