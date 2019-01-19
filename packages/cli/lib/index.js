"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minimist = require("minimist");
// コマンド引数を slice して使える状態にする
const convertArgv = minimist(process.argv.slice(2));
console.log('convertArgv: ', convertArgv);
const argv = {
    yml: convertArgv.yml,
};
const cli = () => {
    return argv;
};
exports.cli = cli;
