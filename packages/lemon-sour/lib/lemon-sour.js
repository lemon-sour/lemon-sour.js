"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yaml_loader_1 = require("./utils/yaml-loader");
/**
 * LemonSour クラス
 */
class LemonSour {
    constructor() { }
    /**
     * run
     * @param args
     */
    run(args) {
        const doc = yaml_loader_1.yamlLoader(args.yml);
        console.log(JSON.stringify(doc, undefined, 2));
    }
}
const lemonSour = new LemonSour();
exports.lemonSour = lemonSour;
