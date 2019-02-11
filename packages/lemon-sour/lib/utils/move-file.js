"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mv = require("mv");
const fs = require("fs");
const razer_1 = require("razer");
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
            files.forEach(file => {
                fileList.push(file);
                mv(prevPath + '/' + file, nextPath + '/' + file, { mkdirp: true }, (err) => {
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
