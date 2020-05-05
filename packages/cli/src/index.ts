import minimist from 'minimist'
import { CliArgsInterface } from './interface/cli-args-interface'

// コマンド引数を slice して使える状態にする
const convertArgv = minimist(process.argv.slice(2))
console.log('convertArgv: ', convertArgv)

const argv = {
  yml: convertArgv.yml,
} as CliArgsInterface

const cli = (): CliArgsInterface => {
  return argv
}

export { cli }
