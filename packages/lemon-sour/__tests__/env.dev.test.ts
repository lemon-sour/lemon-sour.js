import Env from '../src/common/env.dev';

describe('check env.dev', () => {
  test('check env.dev envName is dev', () => {
    expect(Env.envName).toBe('dev');
  });
});
