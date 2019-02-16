process.env.NODE_ENV = 'prod';
import EnvProd from '../src/common/env.prod';
import Env from '../src/common/env';

describe('check env.prod', () => {
  test('check env.prod envName is prod', () => {
    expect(EnvProd.envName).toBe('prod');
  });

  test('should return env is prod', () => {
    expect(Env.envName).toBe('prod');
  });
});
