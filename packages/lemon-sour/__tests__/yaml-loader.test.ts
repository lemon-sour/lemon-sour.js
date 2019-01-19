import { CliArgsInterface } from '@lemon-sour/cli';
import { YmlInterface } from '../src/interface/yml-interface';
import { yamlLoader } from '../src/yaml-loader';

describe('yaml-loader', () => {
  const timeout: number = 10000;

  test(
    'run to load yaml file.',
    () => {
      const args: CliArgsInterface = {
        yml: '../../example/app_a/index.yml',
      };
      const doc: YmlInterface = yamlLoader(args.yml);

      expect(typeof doc).toBe('object');
    },
    timeout,
  );
});
