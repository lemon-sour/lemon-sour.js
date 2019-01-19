import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { YmlInterface } from '../interface/yml-interface';

/**
 * yml ファイルを load する関数
 * TODO: いずれ http を考慮した async/await な実装にする予定
 * @param yml
 */
const yamlLoader = (yml: string = '') => {
  let doc: YmlInterface = yaml.safeLoad(
    // https://stackoverflow.com/questions/15149274/getting-directory-from-which-node-js-was-executed
    fs.readFileSync(process.cwd() + '/' + yml, 'utf8'),
  ) as YmlInterface;

  return doc;
};

export { yamlLoader };
