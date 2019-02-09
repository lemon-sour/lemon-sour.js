"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const app_updater_1 = require("./app-updater");
const workflow_1 = require("./workflow");
const make_directory_1 = require("../utils/make-directory");
const clear_directory_1 = require("../utils/clear-directory");
const get_user_home_1 = require("../utils/get-user-home");
const file_downloader_1 = require("../utils/file-downloader");
const constants_1 = require("../common/constants");
const split_extension_1 = require("../utils/split-extension");
const move_file_1 = require("../utils/move-file");
/**
 * アプリケーションのアップデートの指揮者となるオーケストレーション
 */
class UpdateOrchestration {
    /**
     * constructor
     * @param doc
     */
    constructor(doc) {
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
    checkForUpdates() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('checkForUpdates...');
                for (let i = 0, len = this.workflows.length; i < len; i++) {
                    let appUpdatersOrderByWorkflow = this.findAppUpdater(this.workflows[i].keyName);
                    if (!appUpdatersOrderByWorkflow) {
                        continue;
                    }
                    // 現在のバージョンをロードしておく
                    yield appUpdatersOrderByWorkflow.loadCurrentVersion();
                    // event fire - checkingForUpdate
                    yield appUpdatersOrderByWorkflow.eventsManager.checkingForUpdate.exec();
                    // latestJson をロードする
                    const latest = (yield this.getLatestJson(appUpdatersOrderByWorkflow));
                    appUpdatersOrderByWorkflow.setLatest(latest);
                    appUpdatersOrderByWorkflow.extension = split_extension_1.splitExtension(latest);
                    // Events
                    const currentVersion = yield appUpdatersOrderByWorkflow.getCurrentVersion();
                    this.showVersionLogger(appUpdatersOrderByWorkflow, currentVersion, latest);
                    if (currentVersion <= latest.latestVersion) {
                        // アップデートがある場合
                        appUpdatersOrderByWorkflow.isNeedsUpdate = true;
                    }
                    else {
                        // アップデートがない場合
                        appUpdatersOrderByWorkflow.isNeedsUpdate = false;
                    }
                }
                // ひとつもアップデートがない場合
                if (!this.findAppHasUpdate()) {
                    // すべての UpdateNotAvailable を実行して処理を終了する
                    yield this.execUpdateNotAvailable();
                    return;
                }
                console.log('There are updates.');
                // TODO: temp ディレクトリを作る
                yield make_directory_1.makeDirectory(this.getTempDirectory());
                // TODO: temp デイレクトリの中身を掃除する
                yield clear_directory_1.clearDirectory(this.getTempDirectory());
                // TODO: backup ディレクトリを作る
                yield make_directory_1.makeDirectory(this.getBackupDirectory());
                // TODO: backup デイレクトリの中身を掃除する
                yield clear_directory_1.clearDirectory(this.getBackupDirectory());
                // TODO: アプリケーションを temp ディレクトリにダウンロードする
                console.log('Download apps...');
                yield this.downloadAppsToTempDirectory();
                // TODO: アプリケーションを解凍する
                for (let i = 0, len = this.workflows.length; i < len; i++) {
                    let appUpdatersOrderByWorkflow = this.findAppUpdater(this.workflows[i].keyName);
                    if (!appUpdatersOrderByWorkflow) {
                        continue;
                    }
                    // TODO: 既存のファイルを backup に移動する
                    yield move_file_1.moveAppFile(appUpdatersOrderByWorkflow.name, appUpdatersOrderByWorkflow.extension, appUpdatersOrderByWorkflow.output_path, this.getBackupDirectory());
                    // TODO: アプリケーションを配置する
                    yield move_file_1.moveAppFile(appUpdatersOrderByWorkflow.name, appUpdatersOrderByWorkflow.extension, this.getTempDirectory(), appUpdatersOrderByWorkflow.output_path);
                }
                yield this.execUpdateAvailable();
                for (let i = 0, len = this.workflows.length; i < len; i++) {
                    let appUpdatersOrderByWorkflow = this.findAppUpdater(this.workflows[i].keyName);
                    if (!appUpdatersOrderByWorkflow) {
                        continue;
                    }
                    yield appUpdatersOrderByWorkflow.eventsManager.updateDownloaded.exec();
                    yield appUpdatersOrderByWorkflow.eventsManager.updateNotAvailable.exec();
                    yield appUpdatersOrderByWorkflow.eventsManager.updateAvailable.exec();
                    // 更新後のバージョンを保存する
                    yield appUpdatersOrderByWorkflow.saveCurrentVersion();
                }
            }
            catch (e) {
                yield this.execError();
                throw e;
            }
        });
    }
    /**
     * showVersionLogger
     * @param appUpdatersOrderByWorkflow
     * @param currentVersion
     * @param latest
     */
    showVersionLogger(appUpdatersOrderByWorkflow, currentVersion, latest) {
        console.log(appUpdatersOrderByWorkflow.name);
        console.log('currentVersion:', currentVersion, 'latestVersion:', latest.latestVersion);
    }
    /**
     * validateYml
     * @param doc
     */
    validateYml(doc) {
        if (!doc.hasOwnProperty('version')) {
            throw new Error('yml does not has version');
        }
    }
    /**
     * appUpdatersSetup - AppUpdater のインスタンスを配列に push していく
     * @param doc
     */
    appUpdatersSetup(doc) {
        console.log('version: ', doc.version);
        const keys = Object.keys(doc.jobs);
        _.forEach(keys, (value, index) => {
            console.log('app: ', doc.jobs[value]);
            const appUpdater = new app_updater_1.AppUpdater(value, doc.jobs[value]);
            this.addAppUpdater(appUpdater);
        });
    }
    /**
     * workflowsSetup - Workflow のインスタンスを配列に push していく
     * @param doc
     */
    workflowsSetup(doc) {
        const jobs = doc.workflows.main.jobs;
        _.forEach(jobs, (value, index) => {
            console.log('workflow: ', value);
            const workflow = new workflow_1.Workflow(value);
            this.addWorkflow(workflow);
        });
    }
    /**
     * addAppUpdater - AppUpdaters 配列に AppUpdater を add する
     * @param appUpdater
     */
    addAppUpdater(appUpdater) {
        this.appUpdaters.push(appUpdater);
    }
    /**
     * addWorkflow - Workflows 配列に Workflow を add する
     * @param workflow
     */
    addWorkflow(workflow) {
        this.workflows.push(workflow);
    }
    /**
     * findAppUpdater
     * @param keyName
     */
    findAppUpdater(keyName) {
        const appUpdater = _.find(this.appUpdaters, (o) => {
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
    findAppHasUpdate() {
        return (_.find(this.appUpdaters, (o) => {
            return o.isNeedsUpdate;
        }) !== null);
    }
    /**
     * getTempDirectory
     */
    getTempDirectory() {
        return [get_user_home_1.default(), '/', constants_1.default.pjName, constants_1.default.tempDirectoryName].join('');
    }
    /**
     * getBackupDirectory
     */
    getBackupDirectory() {
        return [get_user_home_1.default(), '/', constants_1.default.pjName, constants_1.default.backupDirectoryName].join('');
    }
    /**
     * downloadAppsToTempDirectory
     */
    downloadAppsToTempDirectory() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0, len = this.workflows.length; i < len; i++) {
                let appUpdatersOrderByWorkflow = this.findAppUpdater(this.workflows[i].keyName);
                if (!appUpdatersOrderByWorkflow) {
                    continue;
                }
                if (!appUpdatersOrderByWorkflow.isNeedsUpdate) {
                    continue;
                }
                yield this.downloadUpdateFile(appUpdatersOrderByWorkflow.name, appUpdatersOrderByWorkflow.latest.fileUrl, appUpdatersOrderByWorkflow.extension, appUpdatersOrderByWorkflow.eventsManager);
            }
        });
    }
    /**
     * downloadUpdateFile
     * @param appName
     * @param fileUrl
     * @param extension
     * @param eventManager
     */
    downloadUpdateFile(appName, fileUrl, extension, eventManager) {
        return __awaiter(this, void 0, void 0, function* () {
            let dStartTime = Date.now();
            const path = [this.getTempDirectory(), '/', appName, '.', extension].join('');
            let _percent;
            return yield file_downloader_1.default(fileUrl, path, (percent, bytes) => __awaiter(this, void 0, void 0, function* () {
                if (_percent === percent) {
                    return;
                }
                _percent = percent;
                console.log(percent);
                yield eventManager.downloadProgress.exec();
                // eventManager.downloadProgress.exec(percent, bytes);
            }), () => {
                let dEndTime = Date.now();
                console.log(appName, 'Download end... ' + (dEndTime - dStartTime) + 'ms');
            });
        });
    }
    /**
     * execUpdateNotAvailable
     */
    execUpdateNotAvailable() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('execUpdateNotAvailable');
            for (let i = 0, len = this.workflows.length; i < len; i++) {
                let appUpdatersOrderByWorkflow = this.findAppUpdater(this.workflows[i].keyName);
                if (!appUpdatersOrderByWorkflow) {
                    continue;
                }
                yield appUpdatersOrderByWorkflow.eventsManager.updateNotAvailable.exec();
            }
        });
    }
    /**
     * execUpdateAvailable
     */
    execUpdateAvailable() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('execUpdateAvailable');
            for (let i = 0, len = this.workflows.length; i < len; i++) {
                let appUpdatersOrderByWorkflow = this.findAppUpdater(this.workflows[i].keyName);
                if (!appUpdatersOrderByWorkflow) {
                    continue;
                }
                yield appUpdatersOrderByWorkflow.eventsManager.updateAvailable.exec();
            }
        });
    }
    /**
     * execError
     */
    execError() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('execError');
            for (let i = 0, len = this.workflows.length; i < len; i++) {
                let appUpdatersOrderByWorkflow = this.findAppUpdater(this.workflows[i].keyName);
                if (!appUpdatersOrderByWorkflow) {
                    continue;
                }
                yield appUpdatersOrderByWorkflow.eventsManager.error.exec();
            }
        });
    }
    /**
     * getLatestJson
     * @param appUpdaters
     */
    getLatestJson(appUpdaters) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!appUpdaters) {
                return;
            }
            // latest.json
            const latest = (yield appUpdaters.loadLatestJsonUrl(appUpdaters.latest_json_url));
            return latest;
        });
    }
}
exports.UpdateOrchestration = UpdateOrchestration;
