"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonfile = require("jsonfile");
/**
 * setJson
 * @param file
 * @param obj
 */
function setJson(file, obj) {
    return new Promise((resolve, reject) => {
        jsonfile.writeFile(file, obj, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            resolve(true);
        });
    });
}
exports.setJson = setJson;
/**
 * getJson
 * @param file
 */
function getJson(file) {
    return new Promise((resolve, reject) => {
        jsonfile.readFile(file)
            .then(obj => resolve(obj))
            .catch(err => reject(err));
    });
}
exports.getJson = getJson;
