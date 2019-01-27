"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = require("eventemitter3");
class PromiseEmitter extends eventemitter3_1.EventEmitter {
    // @ts-ignore: Unreachable code error
    emit(event, ...args) {
        let promises = [];
        this.listeners(event).forEach((listener) => {
            promises.push(listener(...args));
        });
        return Promise.all(promises);
    }
}
exports.default = PromiseEmitter;
