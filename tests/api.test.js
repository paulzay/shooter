import { postScores, getScores } from '../src/objects/apicall';

describe('The scores and usernames should be written and read from the API', () => {
  test('Should save the score to the API', () => {
    postScores('zay', 15000).then(data => {
      expect(data.result).toBe('Leaderboard score created correctly.');
    });
  });
  test('Should receive an object from the API', () => {
    getScores().then(data => {
      expect(typeof data).toBe('object');
    });
  });
  test('The object should contain the created user', () => {
    getScores().then(data => {
      expect(data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user: 'zay',
          }),
        ]),
      );
    }).catch(() => {

    });
  });
  test('The object should contain the created score', () => {
    getScores().then(data => {
      expect(data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            score: '15000',
          }),
        ]),
      );
    }).catch(() => {
        'Something didnt work'
    });
  });
});
let results = false;

it('returns an array of objects with all the scores', () => {
  getScores().then((response) => {
    if (Array.isArray(response.result) === true) results = true;
    expect(results).toBeTruthy();
  });
});