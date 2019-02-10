"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const razer_1 = require("razer");
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
            razer_1.default(`${_fullUrl} handleErrors`);
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
            razer_1.default(`${_fullUrl} prepare`);
            if (didTimeOut) {
                return;
            }
            // ステータスコードとステータステキストを表示
            razer_1.default(`${_fullUrl} ok?: `, response.ok);
            razer_1.default(`${_fullUrl} status: `, response.status);
            razer_1.default(`${_fullUrl} statusText: `, response.statusText);
            return response.json().then((json) => ({ json, response }));
        })
            .then(({ json, response }) => {
            razer_1.default(`fetch then: ${_fullUrl} onFulfilled`);
            if (didTimeOut) {
                return;
            }
            resolve(Object.assign({}, json), response);
        })
            .catch(error => {
            razer_1.default(`fetch catch: ${_fullUrl} onRejected: ${error}`);
            // Clear the timeout as cleanup
            clearTimeout(timeout);
            return reject(error);
        });
    });
}
exports.fetchWithTimeout = fetchWithTimeout;
