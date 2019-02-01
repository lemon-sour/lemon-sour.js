"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonfile = require("jsonfile");
const is_exist_file_1 = require("./utils/is-exist-file");
const make_json_path_from_json_name_1 = require("./utils/make-json-path-from-json-name");
/**
 * getJson
 * @param jsonKeyName
 */
function getJson(jsonKeyName) {
    return new Promise((resolve, reject) => {
        const jsonPath = make_json_path_from_json_name_1.default(jsonKeyName);
        if (!is_exist_file_1.default(jsonPath)) {
            resolve(null);
            return;
        }
        jsonfile
            .readFile(jsonPath)
            .then(obj => resolve(obj))
            .catch(err => reject(err));
    });
}
exports.getJson = getJson;
