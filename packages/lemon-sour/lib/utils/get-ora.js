"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
const constants_1 = __importDefault(require("../common/constants"));
const spinner = ora_1.default({
    spinner: constants_1.default.HEARTS_SPINNER,
    color: 'yellow'
}).start();
function getOra() {
    return spinner;
}
exports.default = getOra;
