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
const yaml_loader_1 = require("./utils/yaml-loader");
const update_orchestration_1 = require("./updater/update-orchestration");
const judgment_online_1 = require("./utils/judgment-online");
const env_1 = require("./common/env");
/**
 * LemonSour クラス
 */
class LemonSour {
    constructor() { }
    /**
     * run - lemon-sour の一番最上階
     * @param args
     */
    run(args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // オンライの判定
                const isOnLine = yield judgment_online_1.judgmentOnLine(env_1.default);
                console.log(1111, isOnLine);
                if (isOnLine) {
                    throw new Error('This is offline.');
                }
                // TODO args.yml がない場合の処理をここでやりたい
                // Load yml file
                const doc = yield yaml_loader_1.yamlLoader(args.yml);
                // console.log(JSON.stringify(doc, undefined, 2));
                // Call to updateOrchestration
                const updateOrchestration = new update_orchestration_1.UpdateOrchestration(doc);
                yield updateOrchestration.checkForUpdates();
            }
            catch (e) {
                throw e;
            }
        });
    }
}
// シングルトンで使ってもらうためにここで new しちゃいます
const lemonSour = new LemonSour();
exports.lemonSour = lemonSour;
