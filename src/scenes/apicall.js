import  LocalStorage from '../objects/localstorage';
const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/TgCyx8x39sLklnB0Pp6c/scores/';
async function postScores(inputName) {
  const data = {
    user: inputName,
    score: LocalStorage.readLocalStorage(),
  };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    }
    throw new Error('Request Failed!');
  } catch (error) {
    return error;
  }
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