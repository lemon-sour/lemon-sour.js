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
        this.validateYml(doc);
        this.updaterSetup(doc);
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
     * updaterSetup - AppUpdater たちのインスタンスを配列に push していく
     * @param doc
     */
    updaterSetup(doc) {
        console.log('version: ', doc.version);
        const keys = Object.keys(doc.jobs);
        _.forEach(keys, (value, index) => {
            console.log('app: ', doc.jobs[value]);
            const appUpdater = new app_updater_1.AppUpdater();
            appUpdater.appSetup(doc.jobs[value]);
            this.add(appUpdater);
        });
    }
    /**
     * add - AppUpdaters 配列に AppUpdater を add する
     * @param appUpdater
     */
    add(appUpdater) {
        this.appUpdaters.push(appUpdater);
    }
    /**
     * checkForUpdates - アップデートがあるかチェックするための外から呼ばれる関数
     */
    checkForUpdates() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('checkForUpdates...');
            try {
                for (let i = 0, len = this.appUpdaters.length; i < len; i++) {
                    const latest = yield this.getLatestJson(i);
                    console.log('latest: ', latest);
                    console.log('name: ', this.appUpdaters[i].name);
                    console.log('latest_json_url: ', this.appUpdaters[i].latest_json_url);
                    console.log('is_archive: ', this.appUpdaters[i].is_archive);
                    console.log('output_path: ', this.appUpdaters[i].output_path);
                    console.log('events: ', this.appUpdaters[i].events);
                    // Events
                    // Workflow
                }
            }
            catch (e) { }
        });
    }
    getLatestJson(i) {
        return __awaiter(this, void 0, void 0, function* () {
            // latest.json
            const latest = (yield this.appUpdaters[i].loadLatestJsonUrl());
            return latest;
        });
    }
}
exports.UpdateOrchestration = UpdateOrchestration;
