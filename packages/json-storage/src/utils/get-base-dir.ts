import findJsonPath from './find-json-path';

const APP_NAME: string = 'json-storage';
// https://docs.npmjs.com/misc/scripts#packagejson-vars
const BASE_DIR: string = findJsonPath(process.env.npm_package_name || APP_NAME);

/**
 * getBaseDir
 */
export default function getBaseDir() {
  return BASE_DIR;
}
