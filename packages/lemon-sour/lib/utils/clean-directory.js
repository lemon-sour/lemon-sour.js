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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rimraf_1 = __importDefault(require("rimraf"));
const razer_1 = __importDefault(require("razer"));
const cleanDirectory = (directoryPath) => __awaiter(void 0, void 0, void 0, function* () {
    razer_1.default('clean directory:', directoryPath + '/*');
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        // https://stackoverflow.com/questions/27072866/how-to-remove-all-files-from-directory-without-removing-directory-in-node-js
        rimraf_1.default(directoryPath + '/*', () => {
            resolve(true);
        });
    }));
});
exports.cleanDirectory = cleanDirectory;
