import Env from '../src/common/env.prod';

describe('check env.prod', () => {
  test('check env.prod envName is prod', () => {
    expect(Env.envName).toBe('prod');
  });
});
