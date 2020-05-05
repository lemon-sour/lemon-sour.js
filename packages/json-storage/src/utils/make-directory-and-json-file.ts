import mkdirp from 'mkdirp';
import * as fs from 'fs';
import getBaseDir from './get-base-dir';

/**
 * makeDirectoryAndJsonFile
 * @param jsonKeyName
 */
export default function makeDirectoryAndJsonFile(jsonKeyName: string) {
  return new Promise<boolean>(
    (resolve: (value: boolean) => void, reject: (err: any) => void) => {
      mkdirp(`${getBaseDir()}`, (err) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        fs.writeFile(`${getBaseDir()}/${jsonKeyName}.json`, null, (err) => {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }

          resolve(true);
        });
      });
    }
  );
}
