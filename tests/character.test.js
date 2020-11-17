import {
  Player,
  Enemy
} from '../src/scenes/gameScene';

jest.mock('../src/objects/player');

test('Test the creation of player object', () => {
  const player = new Player('GameScene', 0, 0, 'player');
  expect(typeof player).toBe('object');
});

test('Test if the player constructor is called when created', () => {
  expect(Player).toHaveBeenCalled();
});
