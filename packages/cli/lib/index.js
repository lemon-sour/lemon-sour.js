"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist_1 = __importDefault(require("minimist"));
const convertArgv = minimist_1.default(process.argv.slice(2));
console.log('convertArgv: ', convertArgv);
const argv = {
    x: convertArgv.x,
};
const cli = () => {
    return argv;
};
exports.cli = cli;
