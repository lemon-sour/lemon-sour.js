"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const constants_1 = require("../common/constants");
/**
 * オフライン・オンラインの判定をする関数
 * @param env
 */
const judgmentOnLine = (env) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        // オフラインかどうかの判定
        if (env.envName !== 'dev') {
            // https://stackoverflow.com/questions/5725430/http-test-server-accepting-get-post-requests
            const response = yield axios_1.default.get(constants_1.default.offLineJudgmentHttpUrl);
            if (response.status !== constants_1.default.HTTP_OK) {
                // offline
                reject(false);
                return;
            }
        }
        // online
        resolve(true);
        return;
    }));
});
exports.judgmentOnLine = judgmentOnLine;
