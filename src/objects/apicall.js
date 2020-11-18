import fetch from 'cross-fetch';

const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/WUMWsoxkHHSWQ8HS7oWT/scores/';
async function postScores(userName, scoreValue) {
  const submit = {
    user: userName,
    score: scoreValue,
  };
  const post = JSON.stringify(submit);
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

async function getScores() {
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