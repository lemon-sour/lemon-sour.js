import { getJson, setJson } from '@lemon-sour/json-storage';
import { InstallApp, Events } from '../interface/yml-interface';
import { BaseAppUpdater } from './base-app-updater';
import { EventsManager } from './events-manager';
import { VersionInterface } from '../interface/version-interface';
import C from '../common/constants';

/**
 * 個々のアプリのアップデート処理を実行、イベントを実行するクラス
 */
class AppUpdater extends BaseAppUpdater {
  // 現在のバージョン
  currentVersion: string;
  // イベントマネージャー
  eventsManager: EventsManager;
  // アップデートがあるかどうか
  isHasUpdate: boolean;

  // jobs の中のアプリのキー名
  keyName: string;

  // アプリの名前
  name: string;
  // latest.json の URL
  latest_json_url: string;
  // アーカイブされたファイルかどうか、アーカイブされている場合は解答しないといけないため
  is_archive: boolean;
  // 展開先のパス
  output_path: string;
  // 各イベントたち
  events: Events;

  /**
   * constructor
   * @param keyName
   * @param installApp
   */
  constructor(keyName: string, installApp: InstallApp) {
    console.log('AppUpdater: ', 'constructor');

    super();

    this.currentVersion = '';
    this.isHasUpdate = false;
    this.keyName = keyName;
    this.name = installApp.name;
    this.latest_json_url = installApp.latest_json_url;
    this.is_archive = installApp.is_archive;
    this.output_path = installApp.output_path;
    this.events = installApp.events;

    this.eventsManager = this.appEventsSetup(this.events);
  }

  private appEventsSetup(events: Events) {
    const eventsManager: EventsManager = new EventsManager(events);
    return eventsManager;
  }

  public async loadCurrentVersion(_version: string = '') {
    const json: VersionInterface | null = (await getJson(
      this.keyName,
    )) as VersionInterface;
    let version = _version || C.INITIAL_VERSION;
    if (json && json.version) {
      version = json.version;
    }
    this.currentVersion = version;
  }

  public async saveCurrentVersion(_version: string = '') {
    this.currentVersion = _version;
    await setJson(this.keyName, { version: _version } as VersionInterface);
  }

  public async getCurrentVersion(): Promise<string> {
    return this.currentVersion;
  }

  /**
   * loadLatestJsonUrl - latestJsonUrl を返す関数
   * @param url
   */
  public async loadLatestJsonUrl(url: string) {
    return await super.loadLatestJsonUrl(url);
  }
}

export { AppUpdater };
