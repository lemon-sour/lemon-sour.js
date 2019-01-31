"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const jsonfile = require("jsonfile");
const mkdirp = require("mkdirp");
const find_json_path_1 = require("./utils/find-json-path");
// const BASE_DIR: string = './__tests__/__data__/';
const APP_NAME = 'json-storage';
// https://docs.npmjs.com/misc/scripts#packagejson-vars
const BASE_DIR = find_json_path_1.default(process.env.npm_package_name || APP_NAME);
function makeDirectoryAndJsonFile(jsonKeyName) {
    return new Promise((resolve, reject) => {
        mkdirp(`${BASE_DIR}`, (err) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            fs.writeFile(`${BASE_DIR}${jsonKeyName}.json`, null, (err) => {
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
function isExistFile(file) {
    try {
        fs.statSync(file);
        return true;
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            return false;
        }
        else {
            return true;
        }
    }
}
function makeJsonPathFromJsonName(jsonKeyName) {
    return `${BASE_DIR}${jsonKeyName}.json`;
}
/**
 * setJson
 * @param jsonName
 * @param obj
 */
function setJson(jsonKeyName, obj) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const jsonPath = makeJsonPathFromJsonName(jsonKeyName);
        if (!isExistFile(jsonPath)) {
            yield makeDirectoryAndJsonFile(jsonKeyName);
        }
        jsonfile.writeFile(jsonPath, obj, err => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            resolve(true);
        });
    }));
}
exports.setJson = setJson;
/**
 * getJson
 * @param file
 */
function getJson(jsonKeyName) {
    return new Promise((resolve, reject) => {
        const jsonPath = makeJsonPathFromJsonName(jsonKeyName);
        if (!isExistFile(jsonPath)) {
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
