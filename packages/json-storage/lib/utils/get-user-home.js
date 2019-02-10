"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getUserHome() {
    // https://stackoverflow.com/questions/9080085/node-js-find-home-directory-in-platform-agnostic-way
    return process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
}
exports.default = getUserHome;
