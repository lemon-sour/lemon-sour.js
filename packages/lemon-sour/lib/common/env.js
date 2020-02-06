"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_dev_1 = __importDefault(require("./env.dev"));
const env_prod_1 = __importDefault(require("./env.prod"));
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
let Env;
if (process.env.NODE_ENV === 'prod') {
    Env = env_prod_1.default;
}
else {
    Env = env_dev_1.default;
}
exports.default = Env;
