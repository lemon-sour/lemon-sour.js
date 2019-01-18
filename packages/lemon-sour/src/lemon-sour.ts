import { CliArgsInterface } from '@lemon-sour/cli';
import { yamlLoader } from './yaml-loader';
import { YmlInterface } from './interface/yml-interface';

class LemonSour {
  constructor() {}

  run(args: CliArgsInterface) {
    console.log('yml', args.yml);
    const doc: YmlInterface = yamlLoader(args.yml);
    console.log(JSON.stringify(doc, undefined, 2));
  }
}

const lemonSour = new LemonSour();
export { lemonSour };
