"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mkdirp_1 = __importDefault(require("mkdirp"));
const fs = __importStar(require("fs"));
const get_base_dir_1 = __importDefault(require("./get-base-dir"));
/**
 * makeDirectoryAndJsonFile
 * @param jsonKeyName
 */
function makeDirectoryAndJsonFile(jsonKeyName) {
    return new Promise((resolve, reject) => {
        mkdirp_1.default(`${get_base_dir_1.default()}`, err => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            fs.writeFile(`${get_base_dir_1.default()}/${jsonKeyName}.json`, null, err => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    });
}
exports.default = makeDirectoryAndJsonFile;
