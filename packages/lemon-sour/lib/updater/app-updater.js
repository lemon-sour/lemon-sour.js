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
const base_app_updater_1 = require("./base-app-updater");
/**
 * 個々のアプリのアップデート処理を実行、イベントを実行するクラス
 */
class AppUpdater extends base_app_updater_1.BaseAppUpdater {
    constructor() {
        console.log('AppUpdater: ', 'constructor');
        super();
    }
    /**
     * appSetup - InstallApp の中身を格納する
     * @param installApp
     */
    appSetup(installApp) {
        this.name = installApp.name;
        this.latest_json_url = installApp.latest_json_url;
        this.is_archive = installApp.is_archive;
        this.output_path = installApp.output_path;
        this.events = installApp.events;
    }
    /**
     * loadLatestJsonUrl - latestJsonUrl を返す関数
     */
    loadLatestJsonUrl() {
        const _super = Object.create(null, {
            loadLatestJsonUrl: { get: () => super.loadLatestJsonUrl }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.loadLatestJsonUrl.call(this);
        });
    }
}
exports.AppUpdater = AppUpdater;
