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
const fs = require("fs");
const yaml = require("js-yaml");
/**
 * yml ファイルを load する関数
 * @param yml
 */
const yamlLoader = (yml) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        if (!yml) {
            reject('yml argument is null');
            return;
        }
        let doc = yaml.safeLoad(
        // https://stackoverflow.com/questions/15149274/getting-directory-from-which-node-js-was-executed
        fs.readFileSync(process.cwd() + '/' + yml, 'utf8'));
        resolve(doc);
    });
});
exports.yamlLoader = yamlLoader;
