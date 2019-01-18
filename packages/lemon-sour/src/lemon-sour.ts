import { CliArgsInterface } from '@lemon-sour/cli';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

let doc = yaml.safeLoad(
  fs.readFileSync('../../example/app_a/index.yml', 'utf8'),
);
console.log(JSON.stringify(doc, undefined, 2));

class LemonSour {
  constructor() {}

  run(args: CliArgsInterface) {
    console.log(args.x);
  }
}

const lemonSour = new LemonSour();
export { lemonSour };
