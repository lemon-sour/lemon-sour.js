'use strict';

import { setJson } from '../src/set-json';

describe('set-json', () => {
  const jsonKeyName = 'foo';

  test('should return value calling set-json', async () => {
    expect.assertions(1);

    const b: boolean = await setJson(jsonKeyName, { a: 'foo' });
    expect(b).toEqual(true);
  });

  test('should return value calling set-json another version', async () => {
    expect.assertions(1);

    const b: boolean = await setJson(jsonKeyName, { b: 'hoge' });
    expect(b).toEqual(true);
  });
});
