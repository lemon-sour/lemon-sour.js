"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonfile = require("jsonfile");
const is_exist_file_1 = require("./utils/is-exist-file");
const make_json_path_from_json_name_1 = require("./utils/make-json-path-from-json-name");
const make_directory_and_json_file_1 = require("./utils/make-directory-and-json-file");
/**
 * setJson
 * @param jsonKeyName
 * @param obj
 */
function setJson(jsonKeyName, obj) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const jsonPath = make_json_path_from_json_name_1.default(jsonKeyName);
        if (!is_exist_file_1.default(jsonPath)) {
            yield make_directory_and_json_file_1.default(jsonKeyName);
        }
        jsonfile.writeFile(jsonPath, obj, err => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            resolve(true);
        });
    }));
}
exports.setJson = setJson;
