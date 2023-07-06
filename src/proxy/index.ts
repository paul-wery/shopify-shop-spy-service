import axios from 'axios';

const { PROXY_HOST, PROXY_PORT, PROXY_USERNAME, PROXY_PASSWORD } = process.env;

export class PoolRequest {
  public get(url: string) {
    try {
      return axios(url, {
        proxy: {
          protocol: 'http',
          host: PROXY_HOST,
          port: parseInt(PROXY_PORT),
          auth: {
            username: `${PROXY_USERNAME}`,
            password: PROXY_PASSWORD,
          },
        },
      });
    } catch (error) {
      console.error(error.message);
    }
    return;
  }
}

export const poolRequest = new PoolRequest();
