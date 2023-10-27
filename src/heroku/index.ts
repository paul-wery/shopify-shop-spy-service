import axios from 'axios';

const HEROKU_APP = process.env.HEROKU_APP;
const HEROKU_TOKEN = process.env.HEROKU_TOKEN;

const options = {
  headers: {
    Accept: 'application/vnd.heroku+json; version=3',
    Authorization: `Bearer ${HEROKU_TOKEN}`,
  },
};

const command = 'npm run start';

export async function getDynos() {
  try {
    const response = await axios(
      `https://api.heroku.com/apps/${HEROKU_APP}/dynos`,
      options
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function stopDynos() {
  try {
    const dynos = await getDynos();

    for (const dyno of dynos) {
      await axios.post(
        `https://api.heroku.com/apps/${HEROKU_APP}/dynos/${dyno.id}/actions/stop`,
        {},
        options
      );
    }
  } catch (error) {
    console.error(error);
  }
}

export async function startDyno() {
  try {
    await axios.post(
      `https://api.heroku.com/apps/${HEROKU_APP}/dynos`,
      { command },
      options
    );
  } catch (error) {
    console.error(error);
  }
}
