import { InstallApp, Events } from '../interface/yml-interface';
import { BaseAppUpdater } from './base-app-updater';

/**
 * 個々のアプリのアップデート処理を実行、イベントを実行するクラス
 */
class AppUpdater extends BaseAppUpdater {
  constructor() {
    console.log('AppUpdater: ', 'constructor');

    super();
  }

  /**
   * appSetup - InstallApp の中身を格納する
   * @param installApp
   */
  appSetup(installApp: InstallApp) {
    this.name = installApp.name;
    this.latest_json_url = installApp.latest_json_url;
    this.is_archive = installApp.is_archive;
    this.output_path = installApp.output_path;
    this.events = installApp.events;
  }

  /**
   * loadLatestJsonUrl - latestJsonUrl を返す関数
   */
  async loadLatestJsonUrl() {
    return await super.loadLatestJsonUrl();
  }
}

export { AppUpdater };
