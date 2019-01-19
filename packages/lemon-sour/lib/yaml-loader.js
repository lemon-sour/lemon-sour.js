"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const yaml = require("js-yaml");
/**
 * yml ファイルを load する関数
 * TODO: いずれ http を考慮した async/await な実装にする予定
 * @param yml
 */
const yamlLoader = (yml = '') => {
    let doc = yaml.safeLoad(fs.readFileSync(process.cwd() + '/' + yml, 'utf8'));
    return doc;
};
exports.yamlLoader = yamlLoader;
