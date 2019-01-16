"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minimist = require("minimist");
const convertArgv = minimist(process.argv.slice(2));
console.log('convertArgv: ', convertArgv);
const argv = {
    x: convertArgv.x,
};
const cli = () => {
    return argv;
};
exports.cli = cli;
