import { Events } from '../interface/yml-interface';
import { fetchWithTimeout } from '../utils/fetch-with-timeout';
import { EventsManager } from './events-manager';

/**
 * 個々のアプリのアップデート処理を実行、イベントを実行する親クラス
 */
class BaseAppUpdater {
  constructor() {}

  /**
   * loadLatestJsonUrl
   */
  public async loadLatestJsonUrl(url: string) {
    return new Promise<object>(
      async (resolve: (value?: object) => void, reject: (err: any) => void) => {
        const myInit = {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
        };

        await fetchWithTimeout(url, myInit)
          .then((json: object) => {
            resolve(json);
          })
          .catch((error: any) => {
            reject(error);
          });
      }
    );
  }
}

export { BaseAppUpdater };
