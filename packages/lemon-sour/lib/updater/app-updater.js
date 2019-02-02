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
const json_storage_1 = require("@lemon-sour/json-storage");
const base_app_updater_1 = require("./base-app-updater");
const events_manager_1 = require("./events-manager");
const constants_1 = require("../common/constants");
/**
 * 個々のアプリのアップデート処理を実行、イベントを実行するクラス
 */
class AppUpdater extends base_app_updater_1.BaseAppUpdater {
    /**
     * constructor
     * @param keyName
     * @param installApp
     */
    constructor(keyName, installApp) {
        console.log('AppUpdater: ', 'constructor');
        super();
        this.currentVersion = '';
        this.isHasUpdate = false;
        this.keyName = keyName;
        this.name = installApp.name;
        this.latest_json_url = installApp.latest_json_url;
        this.is_archive = installApp.is_archive;
        this.output_path = installApp.output_path;
        this.events = installApp.events;
        this.eventsManager = this.appEventsSetup(this.events);
    }
    appEventsSetup(events) {
        const eventsManager = new events_manager_1.EventsManager(events);
        return eventsManager;
    }
    loadCurrentVersion(_version = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const json = (yield json_storage_1.getJson(this.keyName));
            let version = _version || constants_1.default.INITIAL_VERSION;
            if (json && json.version) {
                version = json.version;
            }
            this.currentVersion = version;
        });
    }
    saveCurrentVersion(_version = '') {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentVersion = _version;
            yield json_storage_1.setJson(this.keyName, { version: _version });
        });
    }
    getCurrentVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.currentVersion;
        });
    }
    /**
     * loadLatestJsonUrl - latestJsonUrl を返す関数
     * @param url
     */
    loadLatestJsonUrl(url) {
        const _super = Object.create(null, {
            loadLatestJsonUrl: { get: () => super.loadLatestJsonUrl }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.loadLatestJsonUrl.call(this, url);
        });
    }
}
exports.AppUpdater = AppUpdater;
