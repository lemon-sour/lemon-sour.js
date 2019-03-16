import { CliArgsInterface } from '@lemon-sour/cli'
import { log } from 'node-log-rotate'
import razer from 'razer'
import chalk from 'chalk'
import { yamlLoader } from './utils/yaml-loader'
import { YmlInterface } from './interface/yml-interface'
import { UpdateOrchestration } from './updater/update-orchestration'
import { judgmentOnLine } from './utils/judgment-online'
import getOra from './utils/get-ora'
import Env from './common/env'

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
    log('start LemonSour')
    razer('start LemonSour')

    const spinner = getOra()
    spinner.text = chalk`Running {cyan LemonSour}...\n`

    try {
      // オンラインの判定
      const isOnLine = await judgmentOnLine(Env)
      if (!isOnLine) {
        throw new Error('It seems to be offline.')
      }

      // TODO args.yml がない場合の処理をここでやりたい

      // Load yml file
      const doc: YmlInterface = await yamlLoader(args.yml)
      // console.log(JSON.stringify(doc, undefined, 2));

      // Call to updateOrchestration
      const updateOrchestration: UpdateOrchestration = new UpdateOrchestration(
        doc
      )
      await updateOrchestration.checkForUpdates()

      spinner.succeed(chalk`{magenta LemonSour!} is succeed✨\n`)
    } catch (e) {
      spinner.fail(
        chalk`{red LemonSour} is stopped because getting Error! 😆\n`
      )
      throw e
    }
  }
}

// シングルトンで使ってもらうためにここで new しちゃいます
const lemonSour = new LemonSour()
export { lemonSour }
