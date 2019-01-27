"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
};
console.log('Constants: ', Constants);
exports.default = Constants;
