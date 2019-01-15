process.argv.push('-x', '1');

import { cli } from '../src/index';

describe('index', () => {
  test('run index.', () => {
    const args = cli();
    expect(args.x).toBe(1);
  });
});
