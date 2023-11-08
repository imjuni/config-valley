import { SyncFileHandle } from '#/file/sync/SyncFileHandle';
import fs from 'fs';
import { describe, expect, it, vitest } from 'vitest';

describe('SyncFileHandle', () => {
  it('getter - filePath', () => {
    const filePath = '/a/b/c';
    const fileHandle = new SyncFileHandle(filePath);
    expect(fileHandle.filePath).toEqual(filePath);
  });

  it('read', () => {
    const buf = Buffer.from(JSON.stringify({ name: 'hello' }));
    const spyH01 = vitest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
      return buf;
    });

    const filePath = '/a/b/c';
    const fileHandle = new SyncFileHandle(filePath);

    const data = fileHandle.read();

    spyH01.mockRestore();

    expect(data.toString()).toEqual(buf.toString());
  });

  it('write', () => {
    const buf = Buffer.from(JSON.stringify({ name: 'hello' }));
    const spyH01 = vitest.spyOn(fs, 'writeFileSync').mockImplementationOnce(() => {
      return undefined;
    });

    const filePath = '/a/b/c';
    const fileHandle = new SyncFileHandle(filePath);

    fileHandle.write(buf);
    spyH01.mockRestore();
  });
});
