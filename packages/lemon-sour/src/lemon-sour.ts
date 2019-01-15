import { CliArgsInterface } from '@lemon-sour/cli';
import * as _ from 'lodash';

class LemonSour {
  constructor() {}

  run(args: CliArgsInterface) {
    console.log(args.x);
  }
}

const lemonSour = new LemonSour();
export { lemonSour };
