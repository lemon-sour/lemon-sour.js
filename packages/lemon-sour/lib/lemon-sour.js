"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const yaml = require("js-yaml");
let doc = yaml.safeLoad(fs.readFileSync('../../example/app_a/index.yml', 'utf8'));
console.log(JSON.stringify(doc, undefined, 2));
class LemonSour {
    constructor() { }
    run(args) {
        console.log(args.x);
    }
}
const lemonSour = new LemonSour();
exports.lemonSour = lemonSour;
