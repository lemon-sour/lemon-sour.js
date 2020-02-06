"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_log_rotate_1 = require("node-log-rotate");
const razer_1 = __importDefault(require("razer"));
const chalk_1 = __importDefault(require("chalk"));
const yaml_loader_1 = require("./utils/yaml-loader");
const update_orchestration_1 = require("./updater/update-orchestration");
const judgment_online_1 = require("./utils/judgment-online");
const get_ora_1 = __importDefault(require("./utils/get-ora"));
const env_1 = __importDefault(require("./common/env"));
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
            node_log_rotate_1.log('start LemonSour');
            razer_1.default('start LemonSour');
            const spinner = get_ora_1.default();
            spinner.text = chalk_1.default `Running {cyan LemonSour}...\n`;
            try {
                // オンラインの判定
                const isOnLine = yield judgment_online_1.judgmentOnLine(env_1.default);
                if (!isOnLine) {
                    throw new Error('It seems to be offline.');
                }
                // TODO args.yml がない場合の処理をここでやりたい
                // Load yml file
                const doc = yield yaml_loader_1.yamlLoader(args.yml);
                // console.log(JSON.stringify(doc, undefined, 2));
                // Call to updateOrchestration
                const updateOrchestration = new update_orchestration_1.UpdateOrchestration(doc);
                yield updateOrchestration.checkForUpdates();
                spinner.succeed(chalk_1.default `{magenta LemonSour!} is succeed✨\n`);
            }
            catch (e) {
                spinner.fail(chalk_1.default `{red LemonSour} is stopped because getting Error! 😆\n`);
                throw e;
            }
        });
    }
}
// シングルトンで使ってもらうためにここで new しちゃいます
const lemonSour = new LemonSour();
exports.lemonSour = lemonSour;
