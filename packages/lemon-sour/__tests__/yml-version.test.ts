import { CliArgsInterface } from '@lemon-sour/cli'
import { lemonSour } from '../src/lemon-sour'

describe('yml version test', () => {
  test('should yml does not has version', async () => {
    expect.assertions(1)

    const args: CliArgsInterface = {
      yml: '../../example/app_yml_no_version/config.yml',
    }

    await lemonSour.run(args).catch((e) => {
      expect(e.message).toEqual('yml does not has version')
    })
  })

  test('should yml version is not valid', async () => {
    expect.assertions(1)

    const args: CliArgsInterface = {
      yml: '../../example/app_yml_version_is_not_valid/config.yml',
    }

    await lemonSour.run(args).catch((e) => {
      expect(e.message).toEqual('yml version is not valid')
    })
  })
})
