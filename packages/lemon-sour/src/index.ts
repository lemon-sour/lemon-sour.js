import { cli } from '@lemon-sour/cli';
import { CliArgsInterface } from '@lemon-sour/cli';
import { lemonSour } from './lemon-sour';

const args: CliArgsInterface = cli();

lemonSour.run(args);
