import  LocalStorage from '../objects/localstorage';
const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/M6spAnEcYsmE9Cz83Fi0/scores/';
async function postScores(userName, scoreValue) {
  const submit = {
    user: userName,
    score: scoreValue,
  };
  const post = JSON.stringify(submit);
const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/M6spAnEcYsmE9Cz83Fi0/scores/';
  const settings = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: post,
  };
  const response = await fetch(url, settings);
  const answer = await response.json();
  return answer;
}

function sorting(obj) {
  const array = [];
  for (let i = 0; i < obj.length; i += 1) {
    array.push([obj[i].score, obj[i].user]);
  }
  return Array.from(array).sort((a, b) => b[0] - a[0]);
}

async function getScores() {
const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/M6spAnEcYsmE9Cz83Fi0/scores/';
  try {
    const response = await fetch(url, {
      mode: 'cors',
    });
    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse.result;
    }
    throw new Error('Request Failed!');
  } catch (error) {
    return error;
  }
}

export { getScores, postScores };