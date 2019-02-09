import * as _ from 'lodash';
import { YmlInterface } from '../interface/yml-interface';
import { LatestJsonInterface } from '../interface/latest-json-interface';
import { AppUpdater } from './app-updater';
import { Workflow } from './workflow';
import { makeDirectory } from '../utils/make-directory';
import { clearDirectory } from '../utils/clear-directory';
import getUserHome from '../utils/get-user-home';
import download from '../utils/file-downloader';
import C from '../common/constants';
import { EventsManager } from './events-manager';
import { splitExtension } from '../utils/split-extension';
import { moveAppFile } from '../utils/move-file';

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
        appUpdatersOrderByWorkflow.extension = splitExtension(latest);

        // Events
        const currentVersion = await appUpdatersOrderByWorkflow.getCurrentVersion();
        this.showVersionLogger(
          appUpdatersOrderByWorkflow,
          currentVersion,
          latest,
        );

        if (currentVersion <= latest.latestVersion) {
          // アップデートがある場合
          appUpdatersOrderByWorkflow.isNeedsUpdate = true;
        } else {
          // アップデートがない場合
          appUpdatersOrderByWorkflow.isNeedsUpdate = false;
        }
      }

      // ひとつもアップデートがない場合
      if (!this.findAppHasUpdate()) {
        // すべての UpdateNotAvailable を実行して処理を終了する
        await this.execUpdateNotAvailable();
        return;
      }

      console.log('There are updates.');

      // TODO: temp ディレクトリを作る
      await makeDirectory(this.getTempDirectory());
      // TODO: temp デイレクトリの中身を掃除する
      await clearDirectory(this.getTempDirectory());

      // TODO: backup ディレクトリを作る
      await makeDirectory(this.getBackupDirectory());
      // TODO: backup デイレクトリの中身を掃除する
      await clearDirectory(this.getBackupDirectory());

      // TODO: アプリケーションを temp ディレクトリにダウンロードする
      console.log('Download apps...');
      await this.downloadAppsToTempDirectory();

      // TODO: アプリケーションを解凍する

      for (let i = 0, len = this.workflows.length; i < len; i++) {
        let appUpdatersOrderByWorkflow = this.findAppUpdater(
          this.workflows[i].keyName,
        );
        if (!appUpdatersOrderByWorkflow) {
          continue;
        }

        // TODO: 既存のファイルを backup に移動する
        await moveAppFile(
          appUpdatersOrderByWorkflow.name,
          appUpdatersOrderByWorkflow.extension,
          appUpdatersOrderByWorkflow.output_path,
          this.getBackupDirectory(),
        );
        // TODO: アプリケーションを配置する
        await moveAppFile(
          appUpdatersOrderByWorkflow.name,
          appUpdatersOrderByWorkflow.extension,
          this.getTempDirectory(),
          appUpdatersOrderByWorkflow.output_path,
        );
      }

      await this.execUpdateAvailable();

      for (let i = 0, len = this.workflows.length; i < len; i++) {
        let appUpdatersOrderByWorkflow = this.findAppUpdater(
          this.workflows[i].keyName,
        );
        if (!appUpdatersOrderByWorkflow) {
          continue;
        }

        await appUpdatersOrderByWorkflow.eventsManager.updateDownloaded.exec();
        await appUpdatersOrderByWorkflow.eventsManager.updateNotAvailable.exec();
        await appUpdatersOrderByWorkflow.eventsManager.updateAvailable.exec();

        // 更新後のバージョンを保存する
        await appUpdatersOrderByWorkflow.saveCurrentVersion();
      }
    } catch (e) {
      await this.execError();
      throw e;
    }
  }

  /**
   * showVersionLogger
   * @param appUpdatersOrderByWorkflow
   * @param currentVersion
   * @param latest
   */
  private showVersionLogger(
    appUpdatersOrderByWorkflow: AppUpdater,
    currentVersion: string,
    latest: LatestJsonInterface,
  ) {
    console.log(appUpdatersOrderByWorkflow.name);
    console.log(
      'currentVersion:',
      currentVersion,
      'latestVersion:',
      latest.latestVersion,
    );
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
    const appUpdater = _.find(this.appUpdaters, (o: AppUpdater) => {
      return o.keyName === keyName;
    });
    if (!appUpdater) {
      return null;
    }

    console.log('name: ', appUpdater.name);
    console.log('latest_json_url: ', appUpdater.latest_json_url);
    console.log('is_archive: ', appUpdater.is_archive);
    console.log('output_path: ', appUpdater.output_path);
    console.log('events: ', appUpdater.events);

    return appUpdater;
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

  /**
   * getTempDirectory
   */
  private getTempDirectory(): string {
    return [getUserHome(), '/', C.pjName, C.tempDirectoryName].join('');
  }

  /**
   * getBackupDirectory
   */
  private getBackupDirectory(): string {
    return [getUserHome(), '/', C.pjName, C.backupDirectoryName].join('');
  }

  /**
   * downloadAppsToTempDirectory
   */
  private async downloadAppsToTempDirectory() {
    for (let i = 0, len = this.workflows.length; i < len; i++) {
      let appUpdatersOrderByWorkflow = this.findAppUpdater(
        this.workflows[i].keyName,
      );
      if (!appUpdatersOrderByWorkflow) {
        continue;
      }
      if (!appUpdatersOrderByWorkflow.isNeedsUpdate) {
        continue;
      }
      await this.downloadUpdateFile(
        appUpdatersOrderByWorkflow.name,
        appUpdatersOrderByWorkflow.latest.fileUrl,
        appUpdatersOrderByWorkflow.extension,
        appUpdatersOrderByWorkflow.eventsManager,
      );
    }
  }

  /**
   * downloadUpdateFile
   * @param appName
   * @param fileUrl
   * @param extension
   * @param eventManager
   */
  private async downloadUpdateFile(
    appName: string,
    fileUrl: string,
    extension: string,
    eventManager: EventsManager,
  ) {
    let dStartTime = Date.now();

    const path = [this.getTempDirectory(), '/', appName, '.', extension].join(
      '',
    );
    let _percent: string;
    return await download(
      fileUrl,
      path,
      async (percent: string, bytes: number) => {
        if (_percent === percent) {
          return;
        }

        _percent = percent;
        console.log(percent);
        await eventManager.downloadProgress.exec();
        // eventManager.downloadProgress.exec(percent, bytes);
      },
      () => {
        let dEndTime = Date.now();
        console.log(
          appName,
          'Download end... ' + (dEndTime - dStartTime) + 'ms',
        );
      },
    );
  }

  /**
   * execUpdateNotAvailable
   */
  private async execUpdateNotAvailable() {
    console.log('execUpdateNotAvailable');
    for (let i = 0, len = this.workflows.length; i < len; i++) {
      let appUpdatersOrderByWorkflow = this.findAppUpdater(
        this.workflows[i].keyName,
      );
      if (!appUpdatersOrderByWorkflow) {
        continue;
      }
      await appUpdatersOrderByWorkflow.eventsManager.updateNotAvailable.exec();
    }
  }

  /**
   * execUpdateAvailable
   */
  private async execUpdateAvailable() {
    console.log('execUpdateAvailable');
    for (let i = 0, len = this.workflows.length; i < len; i++) {
      let appUpdatersOrderByWorkflow = this.findAppUpdater(
        this.workflows[i].keyName,
      );
      if (!appUpdatersOrderByWorkflow) {
        continue;
      }
      await appUpdatersOrderByWorkflow.eventsManager.updateAvailable.exec();
    }
  }

  /**
   * execError
   */
  private async execError() {
    console.log('execError');
    for (let i = 0, len = this.workflows.length; i < len; i++) {
      let appUpdatersOrderByWorkflow = this.findAppUpdater(
        this.workflows[i].keyName,
      );
      if (!appUpdatersOrderByWorkflow) {
        continue;
      }
      await appUpdatersOrderByWorkflow.eventsManager.error.exec();
    }
  }

  /**
   * getLatestJson
   * @param appUpdaters
   */
  private async getLatestJson(appUpdaters: AppUpdater) {
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
