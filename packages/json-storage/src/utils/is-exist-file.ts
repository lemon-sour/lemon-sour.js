import * as fs from 'fs';

/**
 * isExistFile
 * @param file
 */
export default function isExistFile(file: string): boolean {
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
