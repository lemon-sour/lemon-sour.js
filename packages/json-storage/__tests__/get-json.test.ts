'use strict';

import { setJson } from '../src/set-json';
import { getJson } from '../src/get-json';

describe('get-json', () => {
  const jsonKeyName = 'foo';

  beforeEach(async () => {
    console.log('beforeEach');

    await setJson(jsonKeyName, { a: 'foo' });
  });

  test('should return value calling get-json', async () => {
    expect.assertions(1);

    const o: any = await getJson(jsonKeyName);
    expect(o.a).toEqual('foo');
  });
});
