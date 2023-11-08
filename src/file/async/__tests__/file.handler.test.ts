import { FileHandle } from '#/file/async/FileHandle';
import fs from 'fs';
import { describe, expect, it, vitest } from 'vitest';

describe('FileHandle', () => {
  it('getter - filePath', () => {
    const filePath = '/a/b/c';
    const fileHandle = new FileHandle(filePath);
    expect(fileHandle.filePath).toEqual(filePath);
  });

  it('read', async () => {
    const buf = Buffer.from(JSON.stringify({ name: 'hello' }));
    const spyH01 = vitest.spyOn(fs.promises, 'readFile').mockImplementationOnce(() => {
      return Promise.resolve(buf);
    });

    const filePath = '/a/b/c';
    const fileHandle = new FileHandle(filePath);

    const data = await fileHandle.read();

    spyH01.mockRestore();

    expect(data.toString()).toEqual(buf.toString());
  });

  it('write', async () => {
    const buf = Buffer.from(JSON.stringify({ name: 'hello' }));
    const spyH01 = vitest.spyOn(fs.promises, 'writeFile').mockImplementationOnce(() => {
      return Promise.resolve();
    });

    const filePath = '/a/b/c';
    const fileHandle = new FileHandle(filePath);

    await expect(
      (async () => {
        await fileHandle.write(buf);
        spyH01.mockRestore();
      })(),
    ).resolves.toBe(undefined);
  });
});
