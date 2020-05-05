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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonfile = __importStar(require("jsonfile"));
const is_exist_file_1 = __importDefault(require("./utils/is-exist-file"));
const make_json_path_from_json_name_1 = __importDefault(require("./utils/make-json-path-from-json-name"));
const make_directory_and_json_file_1 = __importDefault(require("./utils/make-directory-and-json-file"));
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
        jsonfile.writeFile(jsonPath, obj, (err) => {
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
