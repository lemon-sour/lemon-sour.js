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
const fetch_with_timeout_1 = require("../utils/fetch-with-timeout");
/**
 * 個々のアプリのアップデート処理を実行、イベントを実行する親クラス
 */
class BaseAppUpdater {
    constructor() { }
    /**
     * loadLatestJsonUrl
     */
    loadLatestJsonUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const myInit = {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include',
                };
                yield fetch_with_timeout_1.fetchWithTimeout(url, myInit)
                    .then((json) => {
                    resolve(json);
                })
                    .catch((error) => {
                    reject(error);
                });
            }));
        });
    }
}
exports.BaseAppUpdater = BaseAppUpdater;
