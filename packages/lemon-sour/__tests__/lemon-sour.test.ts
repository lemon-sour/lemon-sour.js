import { CliArgsInterface } from '@lemon-sour/cli'
import { lemonSour } from '../src/lemon-sour'

describe('lemon-sour', () => {
  test('should return value is promise object', async () => {
    expect.assertions(1)

    const args: CliArgsInterface = {
      yml: '../../example/app_basic_no_archive/config.yml'
    }

    // Promise が返ってきてることだけをテスト
    expect(typeof lemonSour.run(args)).toBe('object')
  })

  test('should type of catch error object is string', async () => {
    expect.assertions(1)

    const args: CliArgsInterface = {
      yml: '../../example/app_yml_no_version/config.yml'
    }

    await lemonSour.run(args).catch(e => {
      expect(typeof e.message).toBe('string')
    })
  })
})
