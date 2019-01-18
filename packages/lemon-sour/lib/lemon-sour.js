"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yaml_loader_1 = require("./yaml-loader");
class LemonSour {
    constructor() {
    }
    run(args) {
        console.log('yml', args.yml);
        const doc = yaml_loader_1.yamlLoader(args.yml);
        console.log(JSON.stringify(doc, undefined, 2));
    }
}
const lemonSour = new LemonSour();
exports.lemonSour = lemonSour;
