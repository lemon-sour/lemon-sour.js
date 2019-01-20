import { Events } from '../interface/yml-interface';
import { fetchWithTimeout } from '../utils/fetch-with-timeout';

/**
 * 個々のアプリのアップデート処理を実行、イベントを実行する親クラス
 */
class BaseAppUpdater {
  // 現在のバージョン
  currentVersion: string;

  // アプリの名前
  name: string;
  // latest.json の URL
  latest_json_url: string;
  // アーカイブされたファイルかどうか、アーカイブされている場合は解答しないといけないため
  is_archive: boolean;
  // 展開先のパス
  output_path: string;
  // 各イベントたち
  events: Events | undefined;

  constructor() {
    console.log('BaseAppUpdater: ', 'constructor');

    // TODO: ローカルに保存したバージョンをロードしておくこと
    this.currentVersion = '0.0.1';

    this.name = '';
    this.latest_json_url = '';
    this.is_archive = false;
    this.output_path = '';
    this.events = undefined;
  }

  /**
   * loadLatestJsonUrl
   */
  public async loadLatestJsonUrl() {
    return new Promise<object>(
      async (resolve: (value?: object) => void, reject: (err: any) => void) => {
        const myInit = {
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
