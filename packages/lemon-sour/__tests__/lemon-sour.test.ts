import { CliArgsInterface } from '@lemon-sour/cli';
import { lemonSour } from '../src/lemon-sour';

describe('lemon-sour', () => {
  test('return value is promise object.', async () => {
    const args: CliArgsInterface = {
      yml: '../../example/app_basic_no_archive/index.yml',
    };

    // Promise が返ってきてることだけをテスト
    expect(typeof lemonSour.run(args)).toBe('object');
  });

  test('type of catch error object is string.', async () => {
    const args: CliArgsInterface = {
      yml: '../../example/app_no_version/index.yml',
    };

    await lemonSour.run(args).catch(e => {
      expect(typeof e.message).toBe('string');
    });
  });

  test('yml does not has version.', async () => {
    const args: CliArgsInterface = {
      yml: '../../example/app_no_version/index.yml',
    };

    await lemonSour.run(args).catch(e => {
      expect(e.message).toEqual('yml does not has version');
    });
  });
});
