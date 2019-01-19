import { CliArgsInterface } from '@lemon-sour/cli';
import { yamlLoader } from './yaml-loader';
import { YmlInterface } from './interface/yml-interface';

/**
 * LemonSour クラス
 */
class LemonSour {
  constructor() {}

  /**
   * run
   * @param args
   */
  run(args: CliArgsInterface) {
    const doc: YmlInterface = yamlLoader(args.yml);
    console.log(JSON.stringify(doc, undefined, 2));
  }
}

const lemonSour = new LemonSour();
export { lemonSour };
