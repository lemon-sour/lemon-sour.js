import { lemonSour } from '../src/index';

// sample jest code
describe('adder', () => {
  const timeout: number = 10000;

  test(
    'beforeAllValue to equal 10',
    () => {
      expect(typeof lemonSour()).toBe('string');
    },
    timeout,
  );
});
