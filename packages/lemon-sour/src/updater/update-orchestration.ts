import * as _ from 'lodash';
import razer from 'razer';
import { YmlInterface } from '../interface/yml-interface';
import { LatestJsonInterface } from '../interface/latest-json-interface';
import { AppUpdater } from './app-updater';
import { Workflow } from './workflow';
import { makeDirectory } from '../utils/make-directory';
import { cleanDirectory } from '../utils/clean-directory';
import { EventsManager } from './events-manager';
import { splitExtension } from '../utils/split-extension';
import { moveFile } from '../utils/move-file';
import getUserHome from '../utils/get-user-home';
import download from '../utils/file-downloader';
import unzip from '../utils/unzip';
import ymlValidator from '../validator/yml-validator';
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
   * checkForUpdates - アップデートがあるかチェックするための外から呼ばれる関数
   */
  public async checkForUpdates() {
    try {
      razer('checkForUpdates...');
      for (let i = 0, len = this.workflows.length; i < len; i++) {
        let appUpdatersOrderByWorkflow = this.findAppUpdater(
          this.workflows[i].keyName,
        );
        if (!appUpdatersOrderByWorkflow) {
          continue;
        }

        // event fire - checkingForUpdate
        await appUpdatersOrderByWorkflow.eventsManager.checkingForUpdate.exec();

        // 現在のバージョンをロードしておく
        await appUpdatersOrderByWorkflow.loadCurrentVersion();

        // latestJson をロードする
        const latest: LatestJsonInterface = (await this.getLatestJson(
          appUpdatersOrderByWorkflow,
        )) as LatestJsonInterface;
        appUpdatersOrderByWorkflow.setLatest(latest);
        appUpdatersOrderByWorkflow.extension = splitExtension(latest);

        const currentVersion = await appUpdatersOrderByWorkflow.getCurrentVersion();
        this.showVersionLogger(
          appUpdatersOrderByWorkflow,
          currentVersion,
          latest,
        );

        // output_path ディレクトリを作る
        await makeDirectory(appUpdatersOrderByWorkflow.output_path);

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

      razer('There are updates.');

      // event fire - UpdateAvailable
      await this.execUpdateAvailable();

      // download ディレクトリを作る
      await makeDirectory(this.getDownloadDirectory());
      // download デイレクトリの中身を掃除する
      await cleanDirectory(this.getDownloadDirectory());

      // backup ディレクトリを作る
      await makeDirectory(this.getBackupDirectory());
      // backup デイレクトリの中身を掃除する
      await cleanDirectory(this.getBackupDirectory());

      // extract ディレクトリを作る
      await makeDirectory(this.getExtractDirectory());
      // extract デイレクトリの中身を掃除する
      await cleanDirectory(this.getExtractDirectory());

      // アプリケーションを download ディレクトリにダウンロードする
      await this.downloadAppsToDownloadDirectory();

      // is_archive: true なアプリケーションを解凍する
      await this.unzipApp();

      // 既存のファイルを backup に移動する
      await this.saveAppToBackup();

      // アプリケーションを配置する
      await this.loadAppToTargetDirectory();

      for (let i = 0, len = this.workflows.length; i < len; i++) {
        let appUpdatersOrderByWorkflow = this.findAppUpdater(
          this.workflows[i].keyName,
        );
        if (!appUpdatersOrderByWorkflow) {
          continue;
        }

        if (appUpdatersOrderByWorkflow.isNeedsUpdate) {
          // event fire - UpdateDownload
          await appUpdatersOrderByWorkflow.eventsManager.updateDownloaded.exec();

          // 更新後のバージョンを保存する
          await appUpdatersOrderByWorkflow.saveCurrentVersion();
        } else {
          // event fire - UpdateNotAvailable
          await appUpdatersOrderByWorkflow.eventsManager.updateNotAvailable.exec();
        }
      }
    } catch (e) {
      // event fire - Error
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
    razer(
      appUpdatersOrderByWorkflow.name,
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
    try {
      ymlValidator(doc);
    } catch (e) {
      throw e;
    }
  }

  /**
   * appUpdatersSetup - AppUpdater のインスタンスを配列に push していく
   * @param doc
   */
  private appUpdatersSetup(doc: YmlInterface) {
    razer('doc version: ', doc.version);

    const keys: string[] = Object.keys(doc.jobs);
    _.forEach(keys, (value, index) => {
      razer('app: ', doc.jobs[value]);

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
      razer('workflow: ', value);

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

    razer('name: ', appUpdater.name);
    razer('latest_json_url: ', appUpdater.latest_json_url);
    razer('is_archive: ', appUpdater.is_archive);
    razer('output_path: ', appUpdater.output_path);
    razer('events: ', appUpdater.events);

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
   * getDownloadDirectory
   */
  private getDownloadDirectory(): string {
    return [getUserHome(), '/', C.pjName, C.downloadDirectoryName].join('');
  }

  /**
   * getBackupDirectory
   */
  private getBackupDirectory(): string {
    return [getUserHome(), '/', C.pjName, C.backupDirectoryName].join('');
  }

  /**
   * getExtractDirectory
   */
  private getExtractDirectory(): string {
    return [getUserHome(), '/', C.pjName, C.extractDirectoryName].join('');
  }

  /**
   * downloadAppsToDownloadDirectory
   */
  private async downloadAppsToDownloadDirectory() {
    razer('Download apps...');
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
   * @param name
   * @param fileUrl
   * @param extension
   * @param eventManager
   */
  private async downloadUpdateFile(
    name: string,
    fileUrl: string,
    extension: string,
    eventManager: EventsManager,
  ) {
    let dStartTime = Date.now();

    const path = [this.getDownloadDirectory(), '/', name, '.', extension].join(
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
        razer(percent);
        await eventManager.downloadProgress.exec();
      },
      () => {
        let dEndTime = Date.now();
        razer(name, 'Download end... ' + (dEndTime - dStartTime) + 'ms');
      },
    );
  }

  /**
   * unzipApp
   */
  private async unzipApp() {
    for (let i = 0, len = this.workflows.length; i < len; i++) {
      let appUpdatersOrderByWorkflow = this.findAppUpdater(
        this.workflows[i].keyName,
      );
      if (!appUpdatersOrderByWorkflow) {
        continue;
      }
      if (!appUpdatersOrderByWorkflow.is_archive) {
        continue;
      }
      await this.unzipFile(
        appUpdatersOrderByWorkflow.name,
        appUpdatersOrderByWorkflow.is_archive,
        appUpdatersOrderByWorkflow.extension,
      );
    }
  }

  /**
   * unzipFile
   * @param name
   * @param is_archive
   * @param extension
   */
  private async unzipFile(
    name: string,
    is_archive: boolean,
    extension: string,
  ) {
    if (!is_archive) {
      return;
    }

    const path = [this.getDownloadDirectory(), '/', name, '.', extension].join(
      '',
    );

    razer(name, 'Unzip start...');
    let unzipStartTime = Date.now();
    return await unzip(name, path, this.getExtractDirectory(), () => {
      let unzipEndTime = Date.now();
      razer(name, 'Unzip end... ', unzipEndTime - unzipStartTime, 'ms');
    });
  }

  /**
   * saveAppToBackup
   */
  private async saveAppToBackup() {
    for (let i = 0, len = this.workflows.length; i < len; i++) {
      let appUpdatersOrderByWorkflow = this.findAppUpdater(
        this.workflows[i].keyName,
      );
      if (!appUpdatersOrderByWorkflow) {
        continue;
      }

      await moveFile(
        appUpdatersOrderByWorkflow.output_path,
        this.getBackupDirectory(),
      );
    }
  }

  /**
   * loadAppToTargetDirectory
   */
  private async loadAppToTargetDirectory() {
    for (let i = 0, len = this.workflows.length; i < len; i++) {
      let appUpdatersOrderByWorkflow = this.findAppUpdater(
        this.workflows[i].keyName,
      );
      if (!appUpdatersOrderByWorkflow) {
        continue;
      }

      await moveFile(
        this.getExtractDirectory(),
        appUpdatersOrderByWorkflow.output_path,
      );
    }
  }

  /**
   * execUpdateNotAvailable
   */
  private async execUpdateNotAvailable() {
    razer('execUpdateNotAvailable');
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
    razer('execUpdateAvailable');
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
      await appUpdatersOrderByWorkflow.eventsManager.updateAvailable.exec();
    }
  }

  /**
   * execError
   */
  private async execError() {
    razer('execError');
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
