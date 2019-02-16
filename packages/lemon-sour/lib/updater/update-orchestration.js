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
const razer_1 = require("razer");
const app_updater_1 = require("./app-updater");
const workflow_1 = require("./workflow");
const make_directory_1 = require("../utils/make-directory");
const clean_directory_1 = require("../utils/clean-directory");
const split_extension_1 = require("../utils/split-extension");
const move_file_1 = require("../utils/move-file");
const get_user_home_1 = require("../utils/get-user-home");
const file_downloader_1 = require("../utils/file-downloader");
const unzip_1 = require("../utils/unzip");
const yml_validator_1 = require("../validator/yml-validator");
const constants_1 = require("../common/constants");
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
                razer_1.default('checkForUpdates...');
                for (let i = 0, len = this.workflows.length; i < len; i++) {
                    let appUpdatersOrderByWorkflow = this.findAppUpdater(this.workflows[i].keyName);
                    if (!appUpdatersOrderByWorkflow) {
                        continue;
                    }
                    // event fire - checkingForUpdate
                    yield appUpdatersOrderByWorkflow.eventsManager.checkingForUpdate.exec();
                    // 現在のバージョンをロードしておく
                    yield appUpdatersOrderByWorkflow.loadCurrentVersion();
                    // latestJson をロードする
                    const latest = (yield this.getLatestJson(appUpdatersOrderByWorkflow));
                    appUpdatersOrderByWorkflow.setLatest(latest);
                    appUpdatersOrderByWorkflow.extension = split_extension_1.splitExtension(latest);
                    const currentVersion = yield appUpdatersOrderByWorkflow.getCurrentVersion();
                    this.showVersionLogger(appUpdatersOrderByWorkflow, currentVersion, latest);
                    // output_path ディレクトリを作る
                    yield make_directory_1.makeDirectory(appUpdatersOrderByWorkflow.output_path);
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
                razer_1.default('There are updates.');
                // event fire - UpdateAvailable
                yield this.execUpdateAvailable();
                // download ディレクトリを作る
                yield make_directory_1.makeDirectory(this.getDownloadDirectory());
                // download デイレクトリの中身を掃除する
                yield clean_directory_1.cleanDirectory(this.getDownloadDirectory());
                // backup ディレクトリを作る
                yield make_directory_1.makeDirectory(this.getBackupDirectory());
                // backup デイレクトリの中身を掃除する
                yield clean_directory_1.cleanDirectory(this.getBackupDirectory());
                // extract ディレクトリを作る
                yield make_directory_1.makeDirectory(this.getExtractDirectory());
                // extract デイレクトリの中身を掃除する
                yield clean_directory_1.cleanDirectory(this.getExtractDirectory());
                // アプリケーションを download ディレクトリにダウンロードする
                yield this.downloadAppsToDownloadDirectory();
                // is_archive: true なアプリケーションを解凍する
                yield this.unzipApp();
                // 既存のファイルを backup に移動する
                yield this.saveAppToBackup();
                // アプリケーションを配置する
                yield this.loadAppToTargetDirectory();
                for (let i = 0, len = this.workflows.length; i < len; i++) {
                    let appUpdatersOrderByWorkflow = this.findAppUpdater(this.workflows[i].keyName);
                    if (!appUpdatersOrderByWorkflow) {
                        continue;
                    }
                    if (appUpdatersOrderByWorkflow.isNeedsUpdate) {
                        // event fire - UpdateDownload
                        yield appUpdatersOrderByWorkflow.eventsManager.updateDownloaded.exec();
                        // 更新後のバージョンを保存する
                        yield appUpdatersOrderByWorkflow.saveCurrentVersion();
                    }
                    else {
                        // event fire - UpdateNotAvailable
                        yield appUpdatersOrderByWorkflow.eventsManager.updateNotAvailable.exec();
                    }
                }
            }
            catch (e) {
                // event fire - Error
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
        razer_1.default(appUpdatersOrderByWorkflow.name, 'currentVersion:', currentVersion, 'latestVersion:', latest.latestVersion);
    }
    /**
     * validateYml
     * @param doc
     */
    validateYml(doc) {
        try {
            yml_validator_1.default(doc);
        }
        catch (e) {
            throw e;
        }
    }
    /**
     * appUpdatersSetup - AppUpdater のインスタンスを配列に push していく
     * @param doc
     */
    appUpdatersSetup(doc) {
        razer_1.default('doc version: ', doc.version);
        const keys = Object.keys(doc.jobs);
        _.forEach(keys, (value, index) => {
            razer_1.default('app: ', doc.jobs[value]);
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
            razer_1.default('workflow: ', value);
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
        razer_1.default('name: ', appUpdater.name);
        razer_1.default('latest_json_url: ', appUpdater.latest_json_url);
        razer_1.default('is_archive: ', appUpdater.is_archive);
        razer_1.default('output_path: ', appUpdater.output_path);
        razer_1.default('events: ', appUpdater.events);
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
     * getDownloadDirectory
     */
    getDownloadDirectory() {
        return [get_user_home_1.default(), '/', constants_1.default.pjName, constants_1.default.downloadDirectoryName].join('');
    }
    /**
     * getBackupDirectory
     */
    getBackupDirectory() {
        return [get_user_home_1.default(), '/', constants_1.default.pjName, constants_1.default.backupDirectoryName].join('');
    }
    /**
     * getExtractDirectory
     */
    getExtractDirectory() {
        return [get_user_home_1.default(), '/', constants_1.default.pjName, constants_1.default.extractDirectoryName].join('');
    }
    /**
     * downloadAppsToDownloadDirectory
     */
    downloadAppsToDownloadDirectory() {
        return __awaiter(this, void 0, void 0, function* () {
            razer_1.default('Download apps...');
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
     * @param name
     * @param fileUrl
     * @param extension
     * @param eventManager
     */
    downloadUpdateFile(name, fileUrl, extension, eventManager) {
        return __awaiter(this, void 0, void 0, function* () {
            let dStartTime = Date.now();
            const path = [this.getDownloadDirectory(), '/', name, '.', extension].join('');
            let _percent;
            return yield file_downloader_1.default(fileUrl, path, (percent, bytes) => __awaiter(this, void 0, void 0, function* () {
                if (_percent === percent) {
                    return;
                }
                _percent = percent;
                razer_1.default(percent);
                yield eventManager.downloadProgress.exec();
            }), () => {
                let dEndTime = Date.now();
                razer_1.default(name, 'Download end... ' + (dEndTime - dStartTime) + 'ms');
            });
        });
    }
    /**
     * unzipApp
     */
    unzipApp() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0, len = this.workflows.length; i < len; i++) {
                let appUpdatersOrderByWorkflow = this.findAppUpdater(this.workflows[i].keyName);
                if (!appUpdatersOrderByWorkflow) {
                    continue;
                }
                if (!appUpdatersOrderByWorkflow.is_archive) {
                    continue;
                }
                yield this.unzipFile(appUpdatersOrderByWorkflow.name, appUpdatersOrderByWorkflow.is_archive, appUpdatersOrderByWorkflow.extension);
            }
        });
    }
    /**
     * unzipFile
     * @param name
     * @param is_archive
     * @param extension
     */
    unzipFile(name, is_archive, extension) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!is_archive) {
                return;
            }
            const path = [this.getDownloadDirectory(), '/', name, '.', extension].join('');
            razer_1.default(name, 'Unzip start...');
            let unzipStartTime = Date.now();
            return yield unzip_1.default(name, path, this.getExtractDirectory(), () => {
                let unzipEndTime = Date.now();
                razer_1.default(name, 'Unzip end... ', unzipEndTime - unzipStartTime, 'ms');
            });
        });
    }
    /**
     * saveAppToBackup
     */
    saveAppToBackup() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0, len = this.workflows.length; i < len; i++) {
                let appUpdatersOrderByWorkflow = this.findAppUpdater(this.workflows[i].keyName);
                if (!appUpdatersOrderByWorkflow) {
                    continue;
                }
                yield move_file_1.moveFile(appUpdatersOrderByWorkflow.output_path, this.getBackupDirectory());
            }
        });
    }
    /**
     * loadAppToTargetDirectory
     */
    loadAppToTargetDirectory() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0, len = this.workflows.length; i < len; i++) {
                let appUpdatersOrderByWorkflow = this.findAppUpdater(this.workflows[i].keyName);
                if (!appUpdatersOrderByWorkflow) {
                    continue;
                }
                yield move_file_1.moveFile(this.getExtractDirectory(), appUpdatersOrderByWorkflow.output_path);
            }
        });
    }
    /**
     * execUpdateNotAvailable
     */
    execUpdateNotAvailable() {
        return __awaiter(this, void 0, void 0, function* () {
            razer_1.default('execUpdateNotAvailable');
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
            razer_1.default('execUpdateAvailable');
            for (let i = 0, len = this.workflows.length; i < len; i++) {
                let appUpdatersOrderByWorkflow = this.findAppUpdater(this.workflows[i].keyName);
                if (!appUpdatersOrderByWorkflow) {
                    continue;
                }
                if (!appUpdatersOrderByWorkflow.isNeedsUpdate) {
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
            razer_1.default('execError');
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
