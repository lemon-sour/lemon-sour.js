'use strict';

const jsonStorage = require('../src/index');

describe('json-storage', () => {
  const jsonKeyName = 'foo';

  test('set json', async () => {
    expect.assertions(1);

    const b: boolean = await jsonStorage.setJson(jsonKeyName, { a: 'foo' });
    expect(b).toEqual(true);
  });

  test('set json 2', async () => {
    expect.assertions(1);

    const b: boolean = await jsonStorage.setJson(jsonKeyName, { b: 'hoge' });
    expect(b).toEqual(true);
  });

  test('get json', async () => {
    expect.assertions(1);

    const o: any = await jsonStorage.getJson(jsonKeyName);
    expect(o.b).toEqual('hoge');
  });
});
