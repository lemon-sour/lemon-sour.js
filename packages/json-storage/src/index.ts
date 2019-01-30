import * as jsonfile from 'jsonfile';

/**
 * setJson
 * @param file
 * @param obj
 */
function setJson(file: string, obj: any) {
  return new Promise<boolean>(
    (resolve: (value: boolean) => void, reject: (err: any) => void) => {
      jsonfile.writeFile(file, obj, err => {
        if (err) {
          console.error(err);
          return;
        }
        resolve(true);
      });
    },
  );
}

/**
 * getJson
 * @param file
 */
function getJson(file: string) {
  return new Promise<boolean>(
    (resolve: (value: boolean) => void, reject: (err: any) => void) => {
      jsonfile
        .readFile(file)
        .then(obj => resolve(obj))
        .catch(err => reject(err));
    },
  );
}

export { setJson, getJson };
