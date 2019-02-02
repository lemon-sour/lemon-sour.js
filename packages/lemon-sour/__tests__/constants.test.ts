import C from '../src/common/constants';

const pjName: string = require('../package.json').name;

describe('constants', () => {
  test('should return pjName from constants', () => {
    expect.assertions(1);
    expect(C.pjName).toEqual(pjName);
  });

  test('should return INITIAL_VERSION  from constants', () => {
    expect.assertions(1);
    expect(C.INITIAL_VERSION).toEqual('0.0.0');
  });
});
