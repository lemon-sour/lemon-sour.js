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
const childProcess = require("child_process");
/**
 * EventsManager
 */
class EventsManager {
    constructor() {
        console.log('EventsManager: ', 'constructor');
    }
    updateAvailable(sh, outputPath) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._bootCommand(sh, reject);
                resolve();
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    updateDownloaded(sh, outputPath) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._bootCommand(sh, reject);
                resolve();
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    error(sh, outputPath) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._bootCommand(sh, reject);
                resolve();
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    checkingForUpdate(sh, outputPath) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._bootCommand(sh, reject);
                resolve();
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    updateNotAvailable(sh, outputPath) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._bootCommand(sh, reject);
                resolve();
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    _bootCommand(sh, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            yield childProcess.exec(sh, (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
            });
        });
    }
}
exports.EventsManager = EventsManager;
