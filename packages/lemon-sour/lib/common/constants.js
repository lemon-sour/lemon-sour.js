"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const razer_1 = require("razer");
/**
 * プロジェクト名
 * @type {string}
 */
const pjName = require('../../package.json').name;
/**
 * 定数
 */
const Constants = {
    pjName,
    INITIAL_VERSION: '0.0.0',
    VALID_YML_VERSION: 1,
    offLineJudgmentHttpUrl: 'http://httpbin.org/get',
    HTTP_OK: 200,
    downloadDirectoryName: '/download',
    backupDirectoryName: '/backup',
    extractDirectoryName: '/extract',
};
razer_1.default('Constants: ', Constants);
exports.default = Constants;
