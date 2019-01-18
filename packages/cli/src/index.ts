import * as minimist from 'minimist';
import { CliArgsInterface } from './interface/cli-args-interface';

const convertArgv = minimist(process.argv.slice(2));
console.log('convertArgv: ', convertArgv);

const argv = {
  yml: convertArgv.yml,
} as CliArgsInterface;

const cli = (): CliArgsInterface => {
  return argv;
};

export { cli };
