"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonfile = __importStar(require("jsonfile"));
const is_exist_file_1 = __importDefault(require("./utils/is-exist-file"));
const make_json_path_from_json_name_1 = __importDefault(require("./utils/make-json-path-from-json-name"));
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
