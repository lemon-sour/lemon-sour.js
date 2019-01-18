import { CliArgsInterface } from '@lemon-sour/cli';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { YmlInterface } from './interface/yml-interface';

let doc: YmlInterface = yaml.safeLoad(
  fs.readFileSync(__dirname + '/../../../example/app_a/index.yml', 'utf8'),
) as YmlInterface;
console.log(JSON.stringify(doc, undefined, 2));

class LemonSour {
  constructor() {}

  run(args: CliArgsInterface) {
    console.log(args.x);
  }
}

const lemonSour = new LemonSour();
export { lemonSour };
