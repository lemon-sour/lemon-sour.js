import * as _ from 'lodash';
import { YmlInterface } from '../interface/yml-interface';
import { LatestJsonInterface } from '../interface/latest-json-interface';
import { AppUpdater } from './app-updater';

/**
 * アプリケーションのアップデートの指揮者となるオーケストレーション
 */
class UpdateOrchestration {
  // バージョン
  version: number;
  // yml の内容
  doc: YmlInterface;
  // アップデートする AppUpdater 用配列
  appUpdaters: AppUpdater[];

  /**
   * constructor
   * @param doc
   */
  constructor(doc: YmlInterface) {
    this.version = doc.version;
    this.doc = doc;
    this.appUpdaters = [];

    this.validateYml(doc);

    this.appUpdatersSetup(doc);
  }

  /**
   * validateYml
   * @param doc
   */
  private validateYml(doc: YmlInterface) {
    if (!doc.hasOwnProperty('version')) {
      throw new Error('yml does not has version');
    }
  }

  /**
   * updaterSetup - AppUpdater たちのインスタンスを配列に push していく
   * @param doc
   */
  private appUpdatersSetup(doc: YmlInterface) {
    console.log('version: ', doc.version);

    const keys: string[] = Object.keys(doc.jobs);
    _.forEach(keys, (value, index) => {
      console.log('app: ', doc.jobs[value]);

      const appUpdater: AppUpdater = new AppUpdater(value, doc.jobs[value]);

      this.addAppUpdater(appUpdater);
    });
  }

  /**
   * add - AppUpdaters 配列に AppUpdater を add する
   * @param appUpdater
   */
  private addAppUpdater(appUpdater: AppUpdater) {
    this.appUpdaters.push(appUpdater);
  }

  /**
   * checkForUpdates - アップデートがあるかチェックするための外から呼ばれる関数
   */
  public async checkForUpdates() {
    console.log('checkForUpdates...');
    try {
      for (let i = 0, len = this.appUpdaters.length; i < len; i++) {
        const latest = await this.getLatestJson(i);
        console.log('latest: ', latest);
        console.log('name: ', this.appUpdaters[i].name);
        console.log('latest_json_url: ', this.appUpdaters[i].latest_json_url);
        console.log('is_archive: ', this.appUpdaters[i].is_archive);
        console.log('output_path: ', this.appUpdaters[i].output_path);
        console.log('events: ', this.appUpdaters[i].events);

        // Events
        await this.appUpdaters[i].eventsManager.checkingForUpdate.exec();
        await this.appUpdaters[i].eventsManager.updateAvailable.exec();
        await this.appUpdaters[i].eventsManager.downloadProgress.exec();
      }

      // Workflow
      for (let i = 0, len = this.appUpdaters.length; i < len; i++) {
        await this.appUpdaters[i].eventsManager.updateNotAvailable.exec();
        await this.appUpdaters[i].eventsManager.updateDownloaded.exec();
      }
    } catch (e) {
      for (let i = 0, len = this.appUpdaters.length; i < len; i++) {
        await this.appUpdaters[i].eventsManager.error.exec();
      }
    }
  }

  private async getLatestJson(i: number) {
    // latest.json
    const latest: LatestJsonInterface = (await this.appUpdaters[
      i
    ].loadLatestJsonUrl(
      this.appUpdaters[i].latest_json_url,
    )) as LatestJsonInterface;
    return latest;
  }
}

export { UpdateOrchestration };
