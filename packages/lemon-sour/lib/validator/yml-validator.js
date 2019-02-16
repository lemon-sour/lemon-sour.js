"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../common/constants");
function ymlValidator(doc) {
    if (!doc.hasOwnProperty('version')) {
        throw new Error('yml does not has version');
    }
    if (doc.version !== constants_1.default.VALID_YML_VERSION) {
        throw new Error('yml version is not valid');
    }
}
exports.default = ymlValidator;
