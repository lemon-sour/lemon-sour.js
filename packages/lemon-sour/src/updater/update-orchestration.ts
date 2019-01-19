import * as _ from 'lodash';
import { YmlInterface } from '../interface/yml-interface';
import { AppUpdater } from './app-updater';

/**
 * アプリケーションのアップデートの指揮者となるオーケストレーション
 */
class UpdateOrchestration {
  doc: YmlInterface;
  appUpdaters: AppUpdater[];

  constructor(doc: YmlInterface) {
    this.doc = doc;
    this.appUpdaters = [];

    this.updaterSetup(doc);
  }

  updaterSetup(doc: YmlInterface) {
    const keys: string[] = Object.keys(doc.jobs);
    _.forEach(keys, (value, index) => {
      console.log('app name', doc.jobs[value]);

      const appUpdater: AppUpdater = new AppUpdater();
      appUpdater.appSetup(doc.jobs[value]);

      this.add(appUpdater);
    });
  }

  add(appUpdater: AppUpdater) {
    this.appUpdaters.push(appUpdater);
  }

  async checkForUpdates() {
    try {
      console.log('checkForUpdates...');
      for (let i = 0, len = this.appUpdaters.length; i < len; i++) {
        let latest = await this.appUpdaters[i].loadLatestJsonUrl();
        console.log('latest: ', latest);
      }
    } catch (e) {}
  }
}

export { UpdateOrchestration };
