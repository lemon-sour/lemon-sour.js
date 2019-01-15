import minimist from 'minimist';
import { CliArgsInterface } from './interface/cli-args-interface';

const convertArgv = minimist(process.argv.slice(2));
console.log('convertArgv: ', convertArgv);

const argv = {
  x: convertArgv.x,
} as CliArgsInterface;

const cli = (): CliArgsInterface => {
  return argv;
};

export { cli };
