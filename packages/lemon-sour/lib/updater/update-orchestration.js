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
        return (_.find(this.appUpdaters, (o) => {
            return o.keyName === keyName;
        }) || null);
    }
    /**
     * findAppHasUpdate - アップデートがひとつでもあるか確認
     */
    findAppHasUpdate() {
        return _.find(this.appUpdaters, (o) => {
            return o.isNeedsUpdate;
        }) !== null;
    }
    getTempDirectory() {
        return [get_user_home_1.default(), '/', constants_1.default.pjName, constants_1.default.tempDirectoryName].join('');
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
                    console.log('latest: ', latest);
                    console.log('name: ', appUpdatersOrderByWorkflow.name);
                    console.log('latest_json_url: ', appUpdatersOrderByWorkflow.latest_json_url);
                    console.log('is_archive: ', appUpdatersOrderByWorkflow.is_archive);
                    console.log('output_path: ', appUpdatersOrderByWorkflow.output_path);
                    console.log('events: ', appUpdatersOrderByWorkflow.events);
                    // Events
                    const currentVersion = yield appUpdatersOrderByWorkflow.getCurrentVersion();
                    console.log(appUpdatersOrderByWorkflow.name, 'currentVersion:', currentVersion, 'latestVersion:', latest.latestVersion);
                    if (currentVersion <= latest.latestVersion) {
                        // アップデートがある場合
                        appUpdatersOrderByWorkflow.isNeedsUpdate = true;
                    }
                    else {
                        // アップデートがない場合
                        appUpdatersOrderByWorkflow.isNeedsUpdate = false;
                    }
                    yield appUpdatersOrderByWorkflow.eventsManager.updateAvailable.exec();
                    yield appUpdatersOrderByWorkflow.eventsManager.downloadProgress.exec();
                    // 更新後のバージョンを保存する
                    yield appUpdatersOrderByWorkflow.saveCurrentVersion(latest.latestVersion);
                }
                if (!this.findAppHasUpdate()) {
                    console.log('There is no update.');
                    for (let i = 0, len = this.workflows.length; i < len; i++) {
                        let appUpdatersOrderByWorkflow = this.findAppUpdater(this.workflows[i].keyName);
                        if (!appUpdatersOrderByWorkflow) {
                            continue;
                        }
                        yield appUpdatersOrderByWorkflow.eventsManager.updateNotAvailable.exec();
                    }
                    return;
                }
                console.log('There are updates.');
                console.log('Download apps...');
                yield make_directory_1.makeDirectory(this.getTempDirectory());
                yield clear_directory_1.clearDirectory(this.getTempDirectory());
                for (let i = 0, len = this.workflows.length; i < len; i++) {
                    let appUpdatersOrderByWorkflow = this.findAppUpdater(this.workflows[i].keyName);
                    if (!appUpdatersOrderByWorkflow) {
                        continue;
                    }
                    yield appUpdatersOrderByWorkflow.eventsManager.updateDownloaded.exec();
                    yield appUpdatersOrderByWorkflow.eventsManager.updateNotAvailable.exec();
                }
            }
            catch (e) {
                for (let i = 0, len = this.workflows.length; i < len; i++) {
                    let appUpdatersOrderByWorkflow = this.findAppUpdater(this.workflows[i].keyName);
                    if (!appUpdatersOrderByWorkflow) {
                        continue;
                    }
                    yield appUpdatersOrderByWorkflow.eventsManager.error.exec();
                }
                throw e;
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
