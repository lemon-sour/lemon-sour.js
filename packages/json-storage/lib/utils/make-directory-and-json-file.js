"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mkdirp = require("mkdirp");
const fs = require("fs");
const get_base_dir_1 = require("./get-base-dir");
/**
 * makeDirectoryAndJsonFile
 * @param jsonKeyName
 */
function makeDirectoryAndJsonFile(jsonKeyName) {
    return new Promise((resolve, reject) => {
        mkdirp(`${get_base_dir_1.default()}`, err => {
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
