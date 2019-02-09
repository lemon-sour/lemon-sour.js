import * as _ from 'lodash';
import { YmlInterface } from '../interface/yml-interface';
import { LatestJsonInterface } from '../interface/latest-json-interface';
import { AppUpdater } from './app-updater';
import { Workflow } from './workflow';
import { makeDirectory } from '../utils/make-directory';
import { clearDirectory } from '../utils/clear-directory';
import getUserHome from '../utils/get-user-home';
import C from '../common/constants';

/**
 * アプリケーションのアップデートの指揮者となるオーケストレーション
 */
class UpdateOrchestration {
  // バージョン
  version: number | string;
  // yml の内容
  doc: YmlInterface;
  // アップデートする AppUpdater 用配列
  appUpdaters: AppUpdater[];
  // アップデートする Workflow 用配列
  workflows: Workflow[];

  /**
   * constructor
   * @param doc
   */
  constructor(doc: YmlInterface) {
    this.version = doc.version;
    this.doc = doc;
    this.appUpdaters = [];
    this.workflows = [];

    this.validateYml(doc);

    this.appUpdatersSetup(doc);

    this.workflowsSetup(doc);
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
   * appUpdatersSetup - AppUpdater のインスタンスを配列に push していく
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
   * workflowsSetup - Workflow のインスタンスを配列に push していく
   * @param doc
   */
  private workflowsSetup(doc: YmlInterface) {
    const jobs: string[] = doc.workflows.main.jobs;
    _.forEach(jobs, (value, index) => {
      console.log('workflow: ', value);

      const workflow: Workflow = new Workflow(value);

      this.addWorkflow(workflow);
    });
  }

  /**
   * addAppUpdater - AppUpdaters 配列に AppUpdater を add する
   * @param appUpdater
   */
  private addAppUpdater(appUpdater: AppUpdater) {
    this.appUpdaters.push(appUpdater);
  }

  /**
   * addWorkflow - Workflows 配列に Workflow を add する
   * @param workflow
   */
  private addWorkflow(workflow: Workflow) {
    this.workflows.push(workflow);
  }

  /**
   * findAppUpdater
   * @param keyName
   */
  private findAppUpdater(keyName: string): AppUpdater | null {
    return (
      _.find(this.appUpdaters, (o: AppUpdater) => {
        return o.keyName === keyName;
      }) || null
    );
  }

  /**
   * findAppHasUpdate - アップデートがひとつでもあるか確認
   */
  private findAppHasUpdate(): boolean {
    return (
      _.find(this.appUpdaters, (o: AppUpdater) => {
        return o.isNeedsUpdate;
      }) !== null
    );
  }

  private getTempDirectory(): string {
    return [getUserHome(), '/', C.pjName, C.tempDirectoryName].join('');
  }

  /**
   * checkForUpdates - アップデートがあるかチェックするための外から呼ばれる関数
   */
  public async checkForUpdates() {
    try {
      console.log('checkForUpdates...');
      for (let i = 0, len = this.workflows.length; i < len; i++) {
        let appUpdatersOrderByWorkflow = this.findAppUpdater(
          this.workflows[i].keyName,
        );
        if (!appUpdatersOrderByWorkflow) {
          continue;
        }

        // 現在のバージョンをロードしておく
        await appUpdatersOrderByWorkflow.loadCurrentVersion();

        // event fire - checkingForUpdate
        await appUpdatersOrderByWorkflow.eventsManager.checkingForUpdate.exec();

        // latestJson をロードする
        const latest: LatestJsonInterface = (await this.getLatestJson(
          appUpdatersOrderByWorkflow,
        )) as LatestJsonInterface;
        appUpdatersOrderByWorkflow.setLatest(latest);

        console.log('latest: ', latest);
        console.log('name: ', appUpdatersOrderByWorkflow.name);
        console.log(
          'latest_json_url: ',
          appUpdatersOrderByWorkflow.latest_json_url,
        );
        console.log('is_archive: ', appUpdatersOrderByWorkflow.is_archive);
        console.log('output_path: ', appUpdatersOrderByWorkflow.output_path);
        console.log('events: ', appUpdatersOrderByWorkflow.events);

        // Events
        const currentVersion = await appUpdatersOrderByWorkflow.getCurrentVersion();
        console.log(
          appUpdatersOrderByWorkflow.name,
          'currentVersion:',
          currentVersion,
          'latestVersion:',
          latest.latestVersion,
        );
        if (currentVersion <= latest.latestVersion) {
          // アップデートがある場合
          appUpdatersOrderByWorkflow.isNeedsUpdate = true;
        } else {
          // アップデートがない場合
          appUpdatersOrderByWorkflow.isNeedsUpdate = false;
        }
        await appUpdatersOrderByWorkflow.eventsManager.updateAvailable.exec();
        await appUpdatersOrderByWorkflow.eventsManager.downloadProgress.exec();

        // 更新後のバージョンを保存する
        await appUpdatersOrderByWorkflow.saveCurrentVersion(
          latest.latestVersion,
        );
      }

      if (!this.findAppHasUpdate()) {
        console.log('There is no update.');
        for (let i = 0, len = this.workflows.length; i < len; i++) {
          let appUpdatersOrderByWorkflow = this.findAppUpdater(
            this.workflows[i].keyName,
          );
          if (!appUpdatersOrderByWorkflow) {
            continue;
          }

          await appUpdatersOrderByWorkflow.eventsManager.updateNotAvailable.exec();
        }

        return;
      }

      console.log('There are updates.');
      console.log('Download apps...');

      await makeDirectory(this.getTempDirectory());
      await clearDirectory(this.getTempDirectory());

      for (let i = 0, len = this.workflows.length; i < len; i++) {
        let appUpdatersOrderByWorkflow = this.findAppUpdater(
          this.workflows[i].keyName,
        );
        if (!appUpdatersOrderByWorkflow) {
          continue;
        }

        await appUpdatersOrderByWorkflow.eventsManager.updateDownloaded.exec();
        await appUpdatersOrderByWorkflow.eventsManager.updateNotAvailable.exec();
      }
    } catch (e) {
      for (let i = 0, len = this.workflows.length; i < len; i++) {
        let appUpdatersOrderByWorkflow = this.findAppUpdater(
          this.workflows[i].keyName,
        );
        if (!appUpdatersOrderByWorkflow) {
          continue;
        }

        await appUpdatersOrderByWorkflow.eventsManager.error.exec();
      }

      throw e;
    }
  }

  /**
   * getLatestJson
   * @param appUpdaters
   */
  private async getLatestJson(appUpdaters: AppUpdater | null) {
    if (!appUpdaters) {
      return;
    }

    // latest.json
    const latest: LatestJsonInterface = (await appUpdaters.loadLatestJsonUrl(
      appUpdaters.latest_json_url,
    )) as LatestJsonInterface;
    return latest;
  }
}

export { UpdateOrchestration };
