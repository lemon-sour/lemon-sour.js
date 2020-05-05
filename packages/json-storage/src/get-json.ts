import * as jsonfile from 'jsonfile'
import isExistFile from './utils/is-exist-file'
import makeJsonPathFromJsonName from './utils/make-json-path-from-json-name'

/**
 * getJson
 * @param jsonKeyName
 */
export function getJson(jsonKeyName: string): Promise<object | null> {
  return new Promise<object | null>(
    (resolve: (value: object | null) => void, reject: (err: any) => void) => {
      const jsonPath: string = makeJsonPathFromJsonName(jsonKeyName)
      if (!isExistFile(jsonPath)) {
        resolve(null)
        return
      }

      jsonfile
        .readFile(jsonPath)
        .then((obj) => resolve(obj))
        .catch((err) => reject(err))
    }
  )
}
