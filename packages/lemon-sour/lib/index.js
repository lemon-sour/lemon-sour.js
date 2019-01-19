"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = require("@lemon-sour/cli");
const lemon_sour_1 = require("./lemon-sour");
/**
 * bootstrap
 */
const args = cli_1.cli();
lemon_sour_1.lemonSour.run(args);
