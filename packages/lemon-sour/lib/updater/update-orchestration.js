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
    constructor(doc) {
        this.doc = doc;
        this.appUpdaters = [];
        this.updaterSetup(doc);
    }
    updaterSetup(doc) {
        const keys = Object.keys(doc.jobs);
        _.forEach(keys, (value, index) => {
            console.log('app name', doc.jobs[value]);
            const appUpdater = new app_updater_1.AppUpdater();
            appUpdater.appSetup(doc.jobs[value]);
            this.add(appUpdater);
        });
    }
    add(appUpdater) {
        this.appUpdaters.push(appUpdater);
    }
    checkForUpdates() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('checkForUpdates...');
                for (let i = 0, len = this.appUpdaters.length; i < len; i++) {
                    let latest = yield this.appUpdaters[i].loadLatestJsonUrl();
                    console.log('latest: ', latest);
                }
            }
            catch (e) {
            }
        });
    }
}
exports.UpdateOrchestration = UpdateOrchestration;
