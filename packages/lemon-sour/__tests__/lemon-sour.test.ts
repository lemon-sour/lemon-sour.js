import { CliArgsInterface } from '@lemon-sour/cli';
import { lemonSour } from '../src/lemon-sour';

describe('lemon-sour', () => {
  const timeout: number = 10000;

  test(
    'run do not have return value.',
    () => {
      const args: CliArgsInterface = {
        x: 1,
      };

      expect(lemonSour.run(args)).toBe(undefined);
    },
    timeout,
  );
});
