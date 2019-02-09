"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mv = require("mv");
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
                reject(err);
                return;
            }
            console.log(appName, `Moving up the ${tempPath} file to the ${distPath} directory`);
            resolve();
        });
    });
};
exports.moveAppFile = moveAppFile;
