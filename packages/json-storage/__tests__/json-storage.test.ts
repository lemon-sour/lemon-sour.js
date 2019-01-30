'use strict';

const jsonStorage = require('../src/index');

describe('json-storage', () => {
  const file = './__tests__/__data__/data.json';

  test('set json.', async () => {
    expect.assertions(1);

    const b: boolean = await jsonStorage.setJson(file, { a: 'hoge' });
    expect(b).toEqual(true);
  });

  test('get json.', async () => {
    expect.assertions(1);

    const o: any = await jsonStorage.getJson(file);
    expect(o.a).toEqual('hoge');
  });
});
