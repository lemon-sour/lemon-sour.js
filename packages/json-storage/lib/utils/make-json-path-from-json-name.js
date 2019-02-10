"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_base_dir_1 = require("./get-base-dir");
/**
 * makeJsonPathFromJsonName
 * @param jsonKeyName
 */
function makeJsonPathFromJsonName(jsonKeyName) {
    return `${get_base_dir_1.default()}/${jsonKeyName}.json`;
}
exports.default = makeJsonPathFromJsonName;
