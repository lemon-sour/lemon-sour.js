"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const yaml = require("js-yaml");
const yamlLoader = (yml = '') => {
    let doc = yaml.safeLoad(fs.readFileSync(__dirname + '/' + yml, 'utf8'));
    return doc;
};
exports.yamlLoader = yamlLoader;
