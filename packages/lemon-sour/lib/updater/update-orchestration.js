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
                    console.log('latest: ', latest);
                    console.log('name: ', appUpdatersOrderByWorkflow.name);
                    console.log('latest_json_url: ', appUpdatersOrderByWorkflow.latest_json_url);
                    console.log('is_archive: ', appUpdatersOrderByWorkflow.is_archive);
                    console.log('output_path: ', appUpdatersOrderByWorkflow.output_path);
                    console.log('events: ', appUpdatersOrderByWorkflow.events);
                    // Events
                    const currentVersion = yield appUpdatersOrderByWorkflow.getCurrentVersion();
                    console.log(appUpdatersOrderByWorkflow.name, 'currentVersion:', currentVersion, 'latestVersion:', latest.latestVersion);
                    // アップデートがある場合
                    if (currentVersion <= latest.latestVersion) {
                        appUpdatersOrderByWorkflow.isHasUpdate = true;
                    }
                    yield appUpdatersOrderByWorkflow.eventsManager.updateAvailable.exec();
                    yield appUpdatersOrderByWorkflow.eventsManager.downloadProgress.exec();
                    // 現在のバージョンを保存する
                    yield appUpdatersOrderByWorkflow.saveCurrentVersion(latest.latestVersion);
                }
                // Workflow
                for (let i = 0, len = this.workflows.length; i < len; i++) {
                    let appUpdatersOrderByWorkflow = this.findAppUpdater(this.workflows[i].keyName);
                    if (!appUpdatersOrderByWorkflow) {
                        continue;
                    }
                    yield appUpdatersOrderByWorkflow.eventsManager.updateNotAvailable.exec();
                    yield appUpdatersOrderByWorkflow.eventsManager.updateDownloaded.exec();
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
