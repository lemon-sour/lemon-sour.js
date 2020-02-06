"use strict";
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
// https://stackoverflow.com/questions/7323932/how-do-you-follow-an-http-redirect-in-node-js
// https://github.com/follow-redirects/follow-redirects
// import * as http from 'http';
// import * as https from 'https';
const http = require('follow-redirects').http;
const https = require('follow-redirects').https;
const URL = __importStar(require("url"));
const fs = __importStar(require("fs"));
const razer_1 = __importDefault(require("razer"));
const constants_1 = __importDefault(require("../common/constants"));
function download(fileUrl, distPath, progress, callback) {
    return new Promise((resolve, reject) => {
        let timeout = 10000;
        let file = fs.createWriteStream(distPath);
        const parsedUrl = URL.parse(fileUrl);
        let httpObject;
        if (parsedUrl.protocol === 'https:') {
            httpObject = https;
        }
        else {
            httpObject = http;
        }
        let request = httpObject.get(fileUrl).on('response', (res) => {
            if (res.statusCode !== constants_1.default.HTTP_OK) {
                clearTimeout(timeoutId);
                reject(new Error(res.statusMessage));
                return;
            }
            let len = parseInt(res.headers['content-length'], 10);
            let downloaded = 0;
            res
                .on('data', (chunk) => {
                file.write(chunk);
                downloaded += chunk.length;
                razer_1.default('Downloading ' +
                    ((100.0 * downloaded) / len).toFixed(2) +
                    '% ' +
                    downloaded +
                    ' bytes');
                progress(((100.0 * downloaded) / len).toFixed(0), downloaded);
                // reset timeout
                clearTimeout(timeoutId);
                timeoutId = setTimeout(fn, timeout);
            })
                .on('end', () => {
                // clear timeout
                clearTimeout(timeoutId);
                file.end();
                razer_1.default('downloaded to: ' + distPath);
                resolve();
                callback();
            })
                .on('error', (err) => {
                // clear timeout
                razer_1.default('res.on(error): ' + err.message);
                clearTimeout(timeoutId);
                reject(err);
            });
        });
        // error handler
        request.on('error', (err) => {
            razer_1.default('request.on(error): ' + err.message);
            clearTimeout(timeoutId);
            reject(new Error(err.message));
        });
        // generate timeout handler
        let fn = timeoutWrapper(request);
        // set initial timeout
        let timeoutId = setTimeout(fn, timeout);
    });
}
function timeoutWrapper(req) {
    return () => {
        req.abort();
    };
}
exports.default = download;
