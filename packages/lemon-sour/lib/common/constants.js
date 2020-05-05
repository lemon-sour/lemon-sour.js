"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razer_1 = __importDefault(require("razer"));
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
    HEARTS_SPINNER: {
        interval: 100,
        frames: ['💛 ', '💙 ', '💜 ', '💚 '],
    },
    offLineJudgmentHttpUrl: 'http://httpbin.org/get',
    HTTP_OK: 200,
    downloadDirectoryName: '/download',
    backupDirectoryName: '/backup',
    extractDirectoryName: '/extract',
};
razer_1.default('Constants: ', Constants);
exports.default = Constants;
