"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
/**
 * isExistFile
 * @param file
 */
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
exports.default = isExistFile;
