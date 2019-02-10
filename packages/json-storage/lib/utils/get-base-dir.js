"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_user_home_1 = require("./get-user-home");
const APP_NAME = 'json-storage';
// https://docs.npmjs.com/misc/scripts#packagejson-vars
const BASE_DIR = [
    get_user_home_1.default(),
    '/',
    process.env.npm_package_name || APP_NAME,
].join('');
/**
 * getBaseDir
 */
function getBaseDir() {
    return BASE_DIR;
}
exports.default = getBaseDir;
