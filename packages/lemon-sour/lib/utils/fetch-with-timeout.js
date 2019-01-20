"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const FETCH_TIMEOUT = 10000;
function fetchWithTimeout(_fullUrl, myInit) {
    return new Promise((resolve, reject) => {
        let didTimeOut = false;
        const timeout = setTimeout(() => {
            didTimeOut = true;
            console.error(`${_fullUrl} Request timed out`);
            reject(new Error(`${_fullUrl} Request timed out`));
        }, FETCH_TIMEOUT);
        // via https://blog.mudatobunka.org/entry/2016/04/26/092518
        let myRequest = new node_fetch_1.Request(_fullUrl);
        node_fetch_1.default(myRequest, myInit)
            .then((response) => {
            console.log(`${_fullUrl} handleErrors`);
            // Clear the timeout as cleanup
            clearTimeout(timeout);
            if (didTimeOut) {
                return;
            }
            // 4xx系, 5xx系エラーのときには response.ok = false になる
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        })
            .then((response) => {
            console.log(`${_fullUrl} prepare`);
            if (didTimeOut) {
                return;
            }
            // ステータスコードとステータステキストを表示
            console.info(`${_fullUrl} ok?: `, response.ok);
            console.info(`${_fullUrl} status: `, response.status);
            console.info(`${_fullUrl} statusText: `, response.statusText);
            return response.json().then((json) => ({ json, response }));
        })
            .then(({ json, response }) => {
            console.log(`fetch then: ${_fullUrl} onFulfilled`);
            if (didTimeOut) {
                return;
            }
            resolve(Object.assign({}, json), response);
        })
            .catch(error => {
            console.log(`fetch catch: ${_fullUrl} onRejected: ${error}`);
            // Clear the timeout as cleanup
            clearTimeout(timeout);
            return reject(error);
        });
    });
}
exports.fetchWithTimeout = fetchWithTimeout;
