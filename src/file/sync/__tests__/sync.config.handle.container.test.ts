import { SyncConfigHandleContainer } from '#/file/sync/SyncConfigHandleContainer';
import fs from 'fs';
import { assert, describe, expect, it, vitest } from 'vitest';

describe('SyncConfigHandleContainer', () => {
  it('getter-setter', () => {
    const key = 'mytools';
    const container = new SyncConfigHandleContainer({ configKey: key });

    const indexValue = 1;
    container.index = indexValue;

    expect(container.index).toEqual(indexValue);
    expect(container.handles.length).toEqual(4);
  });

  it('without config-key', () => {
    const container01 = new SyncConfigHandleContainer();
    const container02 = new SyncConfigHandleContainer({});
    expect(container01.handles.length).toEqual(1);
    expect(container02.handles.length).toEqual(1);
  });

  it('read function in container success', () => {
    const key = 'mytools';
    const json = { [key]: { name: 'hello' } };
    const container = new SyncConfigHandleContainer({ configKey: key });

    const spyH001 = vitest.spyOn(fs, 'readFileSync').mockImplementation((readFilePath) => {
      if (typeof readFilePath === 'string' && readFilePath.endsWith('package.json')) {
        return Buffer.from(JSON.stringify(json));
      }

      throw new Error('Cannot found file');
    });

    const data = container.read();
    spyH001.mockRestore();

    expect(container.index).toEqual(2);
    expect(data).toMatchObject(json[key]);
  });

  it('invalid index for reader', () => {
    const key = 'mytools';
    const container = new SyncConfigHandleContainer({ configKey: key });

    const spyH001 = vitest.spyOn(fs, 'readFileSync').mockImplementation((_readFilePath) => {
      throw new Error('Cannot found file');
    });

    const data = container.read();
    spyH001.mockRestore();

    expect(data).instanceOf(Error);
  });

  it('invalid index for write', async () => {
    const key = 'mytools';
    const json = { name: 'config-valley', [key]: { name: 'hello' } };
    const container = new SyncConfigHandleContainer({ configKey: key });

    container.index = 99;

    await expect((() => container.write(json))()).rejects.toThrowError();
  });

  it('write function in container success', async () => {
    const key = 'mytools';
    const json = { name: 'config-valley', [key]: { name: 'hello' } };
    const container = new SyncConfigHandleContainer({ configKey: key });

    const spyH001 = vitest.spyOn(fs, 'readFileSync').mockImplementation((readFilePath) => {
      if (typeof readFilePath === 'string' && readFilePath.endsWith('package.json')) {
        return Buffer.from(JSON.stringify(json));
      }

      throw new Error('Cannot found file');
    });

    const data = container.read<{ name: string; world?: string }>();
    spyH001.mockRestore();

    assert(!(data instanceof Error), 'invalid read function');

    data.world = 'test';

    let writeData: unknown;

    const spyH002 = vitest.spyOn(fs, 'writeFileSync').mockImplementation((_writeFilePath, buf) => {
      writeData = buf;
    });

    await container.write(data);
    spyH002.mockRestore();

    expect(writeData).toEqual(
      JSON.stringify({
        name: 'config-valley',
        mytools: { name: 'hello', world: 'test' },
      }),
    );
  });
});
