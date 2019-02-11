"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mv = require("mv");
const razer_1 = require("razer");
/**
 * moveAppFile
 * @param appName
 * @param extension
 * @param tempPath
 * @param distPath
 */
const moveAppFile = (appName, extension, tempPath, distPath) => {
    return new Promise((resolve, reject) => {
        mv(tempPath + '/' + appName + '.' + extension, distPath + '/' + appName + '.' + extension, { mkdirp: true }, (err) => {
            if (err) {
                // 一番最初はまだファイルがないので失敗するので、ここのエラーは基本的に無視する
                // reject(err);
                return;
            }
            razer_1.default(appName, `Moving up the ${tempPath} file to the ${distPath} directory`);
            resolve();
        });
    });
};
exports.moveAppFile = moveAppFile;
