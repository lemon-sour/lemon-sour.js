"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = require("@lemon-sour/cli");
const lemon_sour_1 = require("./lemon-sour");
/**
 * Sentry
 * https://sentry.io/lemon-sour/nodejs/
 */
const Sentry = require('@sentry/node');
Sentry.init({
    dsn: 'https://0120a1efd0a643c7be7abdf8b43f2959@sentry.io/1373564',
});
/**
 * bootstrap
 */
const args = cli_1.cli();
lemon_sour_1.lemonSour.run(args).catch((err) => {
    console.error('index: ', err);
    Sentry.captureException(err);
});
