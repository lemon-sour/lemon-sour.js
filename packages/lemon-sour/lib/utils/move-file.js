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
const mv_1 = __importDefault(require("mv"));
const fs = __importStar(require("fs"));
const razer_1 = __importDefault(require("razer"));
/**
 * moveFile
 * @param prevPath
 * @param nextPath
 */
const moveFile = (prevPath, nextPath) => {
    return new Promise((resolve, reject) => {
        fs.readdir(prevPath, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            const fileList = [];
            files.forEach((file) => {
                fileList.push(file);
                mv_1.default(prevPath + '/' + file, nextPath + '/' + file, { mkdirp: true }, (err) => {
                    if (err) {
                        // 一番最初はまだファイルがないので失敗するので、ここのエラーは基本的に無視する
                        // reject(err);
                        // return;
                    }
                });
            });
            razer_1.default(`Moving up the file list: ${fileList} to the ${nextPath} directory`);
            resolve();
        });
    });
};
exports.moveFile = moveFile;
