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
const rimraf = require("rimraf");
const clearDirectory = (directoryPath) => __awaiter(this, void 0, void 0, function* () {
    console.log('clearDirectory:', directoryPath + '/*');
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        // https://stackoverflow.com/questions/27072866/how-to-remove-all-files-from-directory-without-removing-directory-in-node-js
        rimraf(directoryPath + '/*', () => {
            console.log('done');
            resolve(true);
        });
    }));
});
exports.clearDirectory = clearDirectory;
