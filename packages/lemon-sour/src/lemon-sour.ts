import { CliArgsInterface } from '@lemon-sour/cli';
import { yamlLoader } from './utils/yaml-loader';
import { YmlInterface } from './interface/yml-interface';
import { UpdateOrchestration } from './updater/update-orchestration';

/**
 * LemonSour クラス
 */
class LemonSour {
  constructor() {}

  /**
   * run - lemon-sour の一番最上階
   * @param args
   */
  async run(args: CliArgsInterface) {
    // Load yml file
    const doc: YmlInterface = yamlLoader(args.yml);
    // console.log(JSON.stringify(doc, undefined, 2));

    // Call to updateOrchestration
    const updateOrchestration: UpdateOrchestration = new UpdateOrchestration(
      doc,
    );
    await updateOrchestration.checkForUpdates();
  }
}

const lemonSour = new LemonSour();
export { lemonSour };
