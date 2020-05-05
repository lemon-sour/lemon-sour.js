import { CliArgsInterface } from '@lemon-sour/cli'
import { YmlInterface } from '../src/interface/yml-interface'
import { yamlLoader } from '../src/utils/yaml-loader'

describe('yaml-loader', () => {
  test('should run to load yaml file', async () => {
    expect.assertions(1)

    const args: CliArgsInterface = {
      yml: '../../example/app_basic_no_archive/config.yml',
    }
    const doc: YmlInterface = await yamlLoader(args.yml)

    expect(typeof doc).toBe('object')
  })

  test('should return yml version is 1.0 and type is number', () => {
    expect.assertions(2)

    const args: CliArgsInterface = {
      yml: '../../example/app_basic_no_archive/config.yml',
    }

    return yamlLoader(args.yml).then((data) => {
      // https://twitter.com/hisasann/status/1091753100564619267
      expect(data.version).toEqual(1.0)
      expect(typeof data.version).toBe('number')
    })
  })

  test('should call catch when argument is null', () => {
    expect.assertions(1)

    return yamlLoader(null).catch((err) => {
      expect(err).toEqual('yml argument is null')
    })
  })
})
