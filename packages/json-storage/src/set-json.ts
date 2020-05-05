import * as jsonfile from 'jsonfile'
import isExistFile from './utils/is-exist-file'
import makeJsonPathFromJsonName from './utils/make-json-path-from-json-name'
import makeDirectoryAndJsonFile from './utils/make-directory-and-json-file'

/**
 * setJson
 * @param jsonKeyName
 * @param obj
 */
export function setJson(jsonKeyName: string, obj: any): Promise<boolean> {
  return new Promise<boolean>(
    async (resolve: (value: boolean) => void, reject: (err: any) => void) => {
      const jsonPath: string = makeJsonPathFromJsonName(jsonKeyName)
      if (!isExistFile(jsonPath)) {
        await makeDirectoryAndJsonFile(jsonKeyName)
      }

      jsonfile.writeFile(jsonPath, obj, (err) => {
        if (err) {
          console.error(err)
          reject(err)
          return
        }
        resolve(true)
      })
    }
  )
}
