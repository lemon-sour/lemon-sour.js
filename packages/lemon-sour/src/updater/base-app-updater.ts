import { InstallApp, Events } from '../interface/yml-interface';
import { fetchWithTimeout } from '../utils/fetch-with-timeout';

/**
 * 個々のアプリのアップデート処理を実行、イベントを実行する親クラス
 */
class BaseAppUpdater {
  name: string;
  latest_json_url: string;
  is_archive: boolean;
  output_path: string;
  events: Events | undefined;

  constructor() {
    console.log('BaseAppUpdater: ', 'constructor');

    this.name = '';
    this.latest_json_url = '';
    this.is_archive = false;
    this.output_path = '';
    this.events = undefined;
  }

  async loadLatestJsonUrl() {
    return new Promise<object>(
      async (resolve: (value?: object) => void, reject: (err: any) => void) => {
        console.log('loadLatestJsonUrl: ', this.latest_json_url);

        let myInit = {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
        };

        await fetchWithTimeout(this.latest_json_url, myInit)
          .then((json: object) => {
            resolve(json);
          })
          .catch((error: any) => {
            reject(error);
          });
      },
    );
  }
}

export { BaseAppUpdater };
