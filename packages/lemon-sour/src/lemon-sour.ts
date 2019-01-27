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
    try {
      // TODO オフラインか判定うまくできるならここでやりたい
      // TODO args.yml がない場合の処理をここでやりたい

      // Load yml file
      const doc: YmlInterface = await yamlLoader(args.yml);
      // console.log(JSON.stringify(doc, undefined, 2));

      // Call to updateOrchestration
      const updateOrchestration: UpdateOrchestration = new UpdateOrchestration(
        doc,
      );
      await updateOrchestration.checkForUpdates();
    } catch (e) {
      throw e;
    }
  }
}

// シングルトンで使ってもらうためにここで new しちゃいます
const lemonSour = new LemonSour();
export { lemonSour };
