import fetch, { Request } from 'node-fetch';

const FETCH_TIMEOUT = 10000;

function fetchWithTimeout(_fullUrl: string, myInit: object) {
  return new Promise<object>(
    (
      resolve: (value?: object, response?: any) => void,
      reject: (err: any) => void,
    ) => {
      let didTimeOut: boolean = false;
      const timeout = setTimeout(() => {
        didTimeOut = true;
        console.error(`${_fullUrl} Request timed out`);
        reject(new Error(`${_fullUrl} Request timed out`));
      }, FETCH_TIMEOUT);
      // via https://blog.mudatobunka.org/entry/2016/04/26/092518

      let myRequest = new Request(_fullUrl);

      fetch(myRequest, myInit)
        .then((response: any) => {
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
        .then((response: any) => {
          console.log(`${_fullUrl} prepare`);

          if (didTimeOut) {
            return;
          }

          // ステータスコードとステータステキストを表示
          console.info(`${_fullUrl} ok?: `, response.ok);
          console.info(`${_fullUrl} status: `, response.status);
          console.info(`${_fullUrl} statusText: `, response.statusText);

          return response.json().then((json: any) => ({ json, response }));
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
    },
  );
}

export { fetchWithTimeout };
