import LocalStorage from '../src/objects/localstorage';

const score = 2000;

test('save score to localstorage', () => {
  LocalStorage.saveLocalStorage(score);
  expect(LocalStorage.readLocalStorage('score')).toBe(2000);
});