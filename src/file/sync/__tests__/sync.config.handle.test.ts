import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { SyncConfigHandle } from '#/file/sync/SyncConfigHandle';
import { SyncFileHandle } from '#/file/sync/SyncFileHandle';
import { JsonParser } from '#/parser/json/JsonParser';
import { TsconfigJsonParser } from '#/parser/tsconfig-json/TsconfigJsonParser';
import fs from 'fs';
import { describe, expect, it, vitest } from 'vitest';

describe('SyncConfigHandle', () => {
  it('factory', () => {
    const handle01 = SyncConfigHandle.factory('/a/b/c');
    const handle03 = SyncConfigHandle.factory(new TsconfigJsonParser('mytools'), '/a/b/c');

    expect(handle01.parser.source).toEqual(CE_CONFIG_SOURCE.JSON);
    expect(handle03.parser.source).toEqual(CE_CONFIG_SOURCE.TSCONFIG_JSON);
  });

  it('factory exception', () => {
    expect(() => {
      SyncConfigHandle.factory(new TsconfigJsonParser('mytools') as any);
    }).toThrowError();
  });

  it('read success', () => {
    const json = { name: 'hello' };
    const filePath = '/a/b/c';

    const spyH001 = vitest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
      return Buffer.from(JSON.stringify(json));
    });

    const reader = new SyncConfigHandle(new JsonParser(), new SyncFileHandle(filePath));
    const data = reader.read();

    spyH001.mockRestore();

    expect(data).toMatchObject(json);
  });

  it('read fail', () => {
    const filePath = '/a/b/c';

    const spyH001 = vitest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
      throw new Error('Cannot found file');
    });

    const reader = new SyncConfigHandle(new JsonParser(), new SyncFileHandle(filePath));
    const result = reader.read();
    spyH001.mockRestore();

    expect(result).instanceOf(Error);
  });

  it('stringify', () => {
    const filePath = '/a/b/c';
    const reader = new SyncConfigHandle(new JsonParser(), new SyncFileHandle(filePath));
    const stringified = reader.stringify({ name: 'hello' });

    expect(stringified).toEqual(JSON.stringify({ name: 'hello' }));
  });

  it('write success', async () => {
    const filePath = '/a/b/c';
    const reader = new SyncConfigHandle(new JsonParser(), new SyncFileHandle(filePath));
    const spyH001 = vitest.spyOn(fs, 'writeFileSync').mockImplementationOnce(() => undefined);

    const result = reader.write(Buffer.from(JSON.stringify({ name: 'hello' })));
    spyH001.mockRestore();

    expect(result).toBeTruthy();
  });

  it('write fail', () => {
    const filePath = '/a/b/c';
    const reader = new SyncConfigHandle(new JsonParser(), new SyncFileHandle(filePath));
    const spyH001 = vitest.spyOn(fs, 'writeFileSync').mockImplementationOnce(() => {
      throw new Error('cannot found file');
    });

    const result = reader.write(Buffer.from(JSON.stringify({ name: 'hello' })));
    spyH001.mockRestore();

    expect(result).instanceOf(Error);
  });
});
