"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const splitExtension = (latest) => {
    return latest.fileUrl.split('.').pop() || '';
};
exports.splitExtension = splitExtension;
