import getBaseDir from './get-base-dir';

/**
 * makeJsonPathFromJsonName
 * @param jsonKeyName
 */
export default function makeJsonPathFromJsonName(jsonKeyName: string): string {
  return `${getBaseDir()}/${jsonKeyName}.json`;
}
