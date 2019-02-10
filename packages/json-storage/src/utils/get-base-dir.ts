import getUserHome from './get-user-home';

const APP_NAME: string = 'json-storage';
// https://docs.npmjs.com/misc/scripts#packagejson-vars
const BASE_DIR: string = [
  getUserHome(),
  '/',
  process.env.npm_package_name || APP_NAME,
].join('');

/**
 * getBaseDir
 */
export default function getBaseDir() {
  return BASE_DIR;
}
