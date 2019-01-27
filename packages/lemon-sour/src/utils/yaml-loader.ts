import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { YmlInterface } from '../interface/yml-interface';

/**
 * yml ファイルを load する関数
 * @param yml
 */
const yamlLoader = async (yml: string = '') => {
  return new Promise<YmlInterface>(
    (resolve: (value?: YmlInterface) => void, reject: (err: any) => void) => {
      let doc: YmlInterface = yaml.safeLoad(
        // https://stackoverflow.com/questions/15149274/getting-directory-from-which-node-js-was-executed
        fs.readFileSync(process.cwd() + '/' + yml, 'utf8'),
      ) as YmlInterface;

      resolve(doc);
    },
  );
};

export { yamlLoader };
