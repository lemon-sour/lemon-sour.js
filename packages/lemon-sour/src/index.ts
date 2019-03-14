import { cli } from '@lemon-sour/cli'
import { CliArgsInterface } from '@lemon-sour/cli'
import { lemonSour } from './lemon-sour'

/**
 * Sentry
 * https://sentry.io/lemon-sour/nodejs/
 */
const Sentry = require('@sentry/node')
Sentry.init({
  dsn: 'https://0120a1efd0a643c7be7abdf8b43f2959@sentry.io/1373564'
})

/**
 * bootstrap
 */
const args: CliArgsInterface = cli()
lemonSour.run(args).catch(err => {
  console.error('index: ', err)
  Sentry.captureException(err)
})
