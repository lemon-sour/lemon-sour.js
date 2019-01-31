import * as fs from 'fs';
import * as jsonfile from 'jsonfile';
import * as mkdirp from 'mkdirp';
import findJsonPath from './utils/find-json-path';

// const BASE_DIR: string = './__tests__/__data__/';
const APP_NAME: string = 'json-storage';
// https://docs.npmjs.com/misc/scripts#packagejson-vars
const BASE_DIR: string = findJsonPath(process.env.npm_package_name || APP_NAME);

function makeDirectoryAndJsonFile(jsonKeyName: string) {
  return new Promise<boolean>(
    (resolve: (value: boolean) => void, reject: (err: any) => void) => {
      mkdirp(`${BASE_DIR}`, err => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        fs.writeFile(`${BASE_DIR}${jsonKeyName}.json`, null, err => {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }

          resolve(true);
        });
      });
    },
  );
}

function isExistFile(file: string): boolean {
  try {
    fs.statSync(file);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    } else {
      return true;
    }
  }
}

function makeJsonPathFromJsonName(jsonKeyName: string): string {
  return `${BASE_DIR}${jsonKeyName}.json`;
}

/**
 * setJson
 * @param jsonName
 * @param obj
 */
function setJson(jsonKeyName: string, obj: any): Promise<boolean> {
  return new Promise<boolean>(
    async (resolve: (value: boolean) => void, reject: (err: any) => void) => {
      const jsonPath: string = makeJsonPathFromJsonName(jsonKeyName);
      if (!isExistFile(jsonPath)) {
        await makeDirectoryAndJsonFile(jsonKeyName);
      }

      jsonfile.writeFile(jsonPath, obj, err => {
        if (err) {
          console.error(err);
          reject(err);
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
function getJson(jsonKeyName: string): Promise<object | null> {
  return new Promise<object | null>(
    (resolve: (value: object | null) => void, reject: (err: any) => void) => {
      const jsonPath: string = makeJsonPathFromJsonName(jsonKeyName);
      if (!isExistFile(jsonPath)) {
        resolve(null);
        return;
      }

      jsonfile
        .readFile(jsonPath)
        .then(obj => resolve(obj))
        .catch(err => reject(err));
    },
  );
}

export { setJson, getJson };
