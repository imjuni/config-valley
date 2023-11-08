import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { ConfigHandle } from '#/file/async/ConfigHandle';
import { FileHandle } from '#/file/async/FileHandle';
import { JsonParser } from '#/parser/json/JsonParser';
import { TsconfigJsonParser } from '#/parser/tsconfig-json/TsconfigJsonParser';
import fs from 'fs';
import { describe, expect, it, vitest } from 'vitest';

describe('ConfigHandle', () => {
  it('factory', () => {
    const handle01 = ConfigHandle.factory('/a/b/c');
    const handle03 = ConfigHandle.factory(new TsconfigJsonParser('mytools'), '/a/b/c');

    expect(handle01.parser.source).toEqual(CE_CONFIG_SOURCE.JSON);
    expect(handle03.parser.source).toEqual(CE_CONFIG_SOURCE.TSCONFIG_JSON);
  });

  it('factory exception', () => {
    expect(() => {
      ConfigHandle.factory(new TsconfigJsonParser('mytools') as any);
    }).toThrowError();
  });

  it('read success', async () => {
    const json = { name: 'hello' };
    const filePath = '/a/b/c';

    const spyH001 = vitest.spyOn(fs.promises, 'readFile').mockImplementationOnce(() => {
      return Promise.resolve(Buffer.from(JSON.stringify(json)));
    });

    const configHandle = new ConfigHandle(new JsonParser(), new FileHandle(filePath));
    const data = await configHandle.read();

    spyH001.mockRestore();

    expect(data).toMatchObject(json);
  });

  it('read fail', async () => {
    const filePath = '/a/b/c';

    const spyH001 = vitest.spyOn(fs.promises, 'readFile').mockImplementationOnce(() => {
      throw new Error('Cannot found file');
    });

    const configHandle = new ConfigHandle(new JsonParser(), new FileHandle(filePath));
    const result = await configHandle.read();
    spyH001.mockRestore();

    expect(result).instanceOf(Error);
  });

  it('stringify', () => {
    const filePath = '/a/b/c';
    const configHandle = new ConfigHandle(new JsonParser(), new FileHandle(filePath));
    const stringified = configHandle.stringify({ name: 'hello' });

    expect(stringified).toEqual(JSON.stringify({ name: 'hello' }));
  });

  it('write success', async () => {
    const filePath = '/a/b/c';
    const configHandle = new ConfigHandle(new JsonParser(), new FileHandle(filePath));

    const spyH001 = vitest.spyOn(fs.promises, 'writeFile').mockImplementationOnce(() => {
      return Promise.resolve();
    });

    const result = await configHandle.write(Buffer.from(JSON.stringify({ name: 'hello' })));
    spyH001.mockRestore();

    expect(result).toBeTruthy();
  });

  it('write fail', async () => {
    const filePath = '/a/b/c';
    const configHandle = new ConfigHandle(new JsonParser(), new FileHandle(filePath));

    const spyH001 = vitest.spyOn(fs.promises, 'writeFile').mockImplementationOnce(() => {
      throw new Error('cannot found file');
    });

    const result = await configHandle.write(Buffer.from(JSON.stringify({ name: 'hello' })));
    spyH001.mockRestore();

    expect(result).instanceOf(Error);
  });
});
