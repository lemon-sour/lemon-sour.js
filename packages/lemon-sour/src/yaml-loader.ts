import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { YmlInterface } from './interface/yml-interface';

const yamlLoader = (yml: string = '') => {
  let doc: YmlInterface = yaml.safeLoad(
    fs.readFileSync(__dirname + '/' + yml, 'utf8'),
  ) as YmlInterface;

  return doc;
};

export { yamlLoader };
