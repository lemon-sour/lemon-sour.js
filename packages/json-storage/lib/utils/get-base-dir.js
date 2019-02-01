"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const find_json_path_1 = require("./find-json-path");
const APP_NAME = 'json-storage';
// https://docs.npmjs.com/misc/scripts#packagejson-vars
const BASE_DIR = find_json_path_1.default(process.env.npm_package_name || APP_NAME);
/**
 * getBaseDir
 */
function getBaseDir() {
    return BASE_DIR;
}
exports.default = getBaseDir;
