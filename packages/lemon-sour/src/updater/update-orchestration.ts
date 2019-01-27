import * as _ from 'lodash';
import { YmlInterface } from '../interface/yml-interface';
import { LatestJsonInterface } from '../interface/latest-json-interface';
import { AppUpdater } from './app-updater';
import { EventsManager } from './events-manager';

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

    this.updaterSetup(doc);
  }

  /**
   * updaterSetup - AppUpdater たちのインスタンスを配列に push していく
   * @param doc
   */
  private updaterSetup(doc: YmlInterface) {
    console.log('version: ', doc.version);

    const keys: string[] = Object.keys(doc.jobs);
    _.forEach(keys, (value, index) => {
      console.log('app: ', doc.jobs[value]);

      const appUpdater: AppUpdater = new AppUpdater();
      appUpdater.appSetup(doc.jobs[value]);

      this.add(appUpdater);
    });
  }

  /**
   * add - AppUpdaters 配列に AppUpdater を add する
   * @param appUpdater
   */
  private add(appUpdater: AppUpdater) {
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

        // Workflow
      }
    } catch (e) {}
  }

  private async getLatestJson(i: number) {
    // latest.json
    const latest: LatestJsonInterface = (await this.appUpdaters[
      i
    ].loadLatestJsonUrl()) as LatestJsonInterface;
    return latest;
  }
}

export { UpdateOrchestration };
