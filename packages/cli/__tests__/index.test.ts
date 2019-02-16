// https://github.com/facebook/jest/issues/5089
process.argv.push('--yml', '../../example/app_basic_no_archive/config.yml');

import { cli } from '../src/index';
import { CliArgsInterface } from '../src/interface/cli-args-interface';

describe('index', () => {
  test('run index.', () => {
    const args: CliArgsInterface = cli();
    expect(typeof args.yml).toBe('string');
  });
});
