process.env.NODE_ENV = 'dev';
import EnvDev from '../src/common/env.dev';
import Env from '../src/common/env';

describe('check env.dev', () => {
  test('check env.dev envName is dev', () => {
    expect(EnvDev.envName).toBe('dev');
  });

  test('should return env is dev', () => {
    expect(Env.envName).toBe('dev');
  });
});
