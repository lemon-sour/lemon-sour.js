// https://github.com/facebook/jest/issues/5089
process.argv.push('-x', '1');

import { cli } from '../src/index';
import { CliArgsInterface } from '../src/interface/cli-args-interface';

describe('index', () => {
  test('run index.', () => {
    const args: CliArgsInterface = cli();
    expect(args.x).toBe(1);
  });
});
