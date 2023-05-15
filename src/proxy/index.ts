import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const { PROXY_USERNAME, PROXY_PASSWORD } = process.env;

export class PoolRequest {
  private readonly _MAX_REQUESTS_BY_ID = 50;
  private _sessionId: string;
  private _requestsCount: number;
  private _logs: { sessionId: string; requestsCount: number }[] = [];

  constructor() {
    this._switchSession();
  }

  private _switchSession() {
    console.info('Switching session');
    this._logs.push({
      sessionId: this._sessionId,
      requestsCount: this._requestsCount,
    });
    this._sessionId = uuidv4().replace(/-/g, '');
    this._requestsCount = 0;
  }

  public get(url: string) {
    this._requestsCount++;
    if (this._requestsCount >= this._MAX_REQUESTS_BY_ID) {
      this._switchSession();
    }
    // console.log('Request count:', this._requestsCount);
    try {
      return axios(url, {
        proxy: {
          protocol: 'http',
          host: 'zproxy.lum-superproxy.io',
          port: 22225,
          auth: {
            // username: `${PROXY_USERNAME}-session-${this._sessionId}`,
            username: `${PROXY_USERNAME}`,
            password: PROXY_PASSWORD,
          },
        },
      });
    } catch (error) {
      console.error(error.message);
      if (error.message.includes('430')) {
        this._switchSession();
      }
    }
    return;
  }

  public getLogs() {
    return this._logs;
  }
}

export const poolRequest = new PoolRequest();
