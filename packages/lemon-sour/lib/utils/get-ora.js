"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = require("ora");
const constants_1 = require("../common/constants");
const spinner = ora_1.default({
    spinner: constants_1.default.HEARTS_SPINNER,
    color: 'yellow'
}).start();
function getOra() {
    return spinner;
}
exports.default = getOra;
