import { ConfigHandleContainer } from '#/file/async/ConfigHandleContainer';
import fs from 'fs';
import { assert, describe, expect, it, vitest } from 'vitest';

describe('ConfigHandleContainer', () => {
  it('getter-setter', () => {
    const key = 'mytools';
    const container = new ConfigHandleContainer({
      configKey: key,
    });

    const indexValue = 1;
    container.index = indexValue;

    expect(container.index).toEqual(indexValue);
    expect(container.handles.length).toEqual(4);
  });

  it('without config-key', () => {
    const container01 = new ConfigHandleContainer();
    const container02 = new ConfigHandleContainer({});
    expect(container01.handles.length).toEqual(1);
    expect(container02.handles.length).toEqual(1);
  });

  it('read function in container success', async () => {
    const key = 'mytools';
    const json = { [key]: { name: 'hello' } };
    const container = new ConfigHandleContainer({
      configKey: key,
    });

    const spyH001 = vitest.spyOn(fs.promises, 'readFile').mockImplementation((readFilePath) => {
      if (typeof readFilePath === 'string' && readFilePath.endsWith('package.json')) {
        return Promise.resolve(Buffer.from(JSON.stringify(json)));
      }

      throw new Error('Cannot found file');
    });

    const config = await container.read();
    spyH001.mockRestore();

    expect(container.index).toEqual(2);
    expect(config).toMatchObject(json[key]);
  });

  it('invalid index for write', async () => {
    const key = 'mytools';
    const json = { name: 'config-valley', [key]: { name: 'hello' } };
    const container = new ConfigHandleContainer({
      configKey: key,
    });

    container.index = 99;

    await expect((async () => container.write(json))()).rejects.toThrowError();
  });

  it('write function in container success', async () => {
    const key = 'mytools';
    const json = { name: 'config-valley', [key]: { name: 'hello' } };
    const container = new ConfigHandleContainer({
      configKey: key,
    });

    const spyH001 = vitest.spyOn(fs.promises, 'readFile').mockImplementation((readFilePath) => {
      if (typeof readFilePath === 'string' && readFilePath.endsWith('package.json')) {
        return Promise.resolve(Buffer.from(JSON.stringify(json)));
      }

      throw new Error('Cannot found file');
    });

    const config = await container.read<{ name: string; world?: string }>();
    spyH001.mockRestore();

    assert(!(config instanceof Error), 'invalid read function');

    config.world = 'test';

    let writeData: unknown;

    const spyH002 = vitest
      .spyOn(fs.promises, 'writeFile')
      .mockImplementation((_writeFilePath, buf) => {
        writeData = buf;
        return Promise.resolve();
      });

    await container.write(config);
    spyH002.mockRestore();

    expect(writeData).toEqual(
      JSON.stringify({
        name: 'config-valley',
        mytools: { name: 'hello', world: 'test' },
      }),
    );
  });
});
