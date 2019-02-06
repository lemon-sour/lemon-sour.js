"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_dev_1 = require("./env.dev");
const env_prod_1 = require("./env.prod");
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
let Env;
if (process.env.NODE_ENV === 'prod') {
    Env = env_prod_1.default;
}
else {
    Env = env_dev_1.default;
}
exports.default = Env;
