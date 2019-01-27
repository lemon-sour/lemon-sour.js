import { CliArgsInterface } from '@lemon-sour/cli';
import { lemonSour } from '../src/lemon-sour';

describe('lemon-sour', () => {
  const timeout: number = 10000;

  test(
    'run do not have return value.',
    async () => {
      const args: CliArgsInterface = {
        yml: '../../example/app_basic_no_archive/index.yml',
      };

      expect(typeof lemonSour.run(args)).toBe('object');
    },
    timeout,
  );
});
