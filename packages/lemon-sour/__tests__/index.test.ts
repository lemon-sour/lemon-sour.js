// https://github.com/facebook/jest/issues/5089
process.argv.push('--yml', '../../../example/app_a/index.yml');

import '../src/index';

describe('index', () => {
  test('run index.', () => {});
});
