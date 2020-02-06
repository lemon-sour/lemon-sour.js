"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_base_dir_1 = __importDefault(require("./get-base-dir"));
/**
 * makeJsonPathFromJsonName
 * @param jsonKeyName
 */
function makeJsonPathFromJsonName(jsonKeyName) {
    return `${get_base_dir_1.default()}/${jsonKeyName}.json`;
}
exports.default = makeJsonPathFromJsonName;
