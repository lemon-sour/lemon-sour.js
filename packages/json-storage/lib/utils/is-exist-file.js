"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
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
