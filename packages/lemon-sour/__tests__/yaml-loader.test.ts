import { CliArgsInterface } from '@lemon-sour/cli';
import { YmlInterface } from '../src/interface/yml-interface';
import { yamlLoader } from '../src/utils/yaml-loader';

describe('yaml-loader', () => {
  test('run to load yaml file.', async () => {
    const args: CliArgsInterface = {
      yml: '../../example/app_basic_no_archive/index.yml',
    };
    const doc: YmlInterface = await yamlLoader(args.yml);

    expect(typeof doc).toBe('object');
  });
});
