import type { IParser } from '#/common/interfaces/IParser';
import { SyncFileHandle } from '#/file/sync/SyncFileHandle';
import { JsonParser } from '#/parser/json/JsonParser';
import { isError } from 'my-easy-fp';

export class SyncConfigHandle {
  static factory(parser: IParser, filePath: string): SyncConfigHandle;
  static factory(filePath: string): SyncConfigHandle;
  static factory(filePathOrParser: IParser | string, key?: string): SyncConfigHandle {
    if (typeof filePathOrParser === 'string') {
      return new SyncConfigHandle(new JsonParser(), new SyncFileHandle(filePathOrParser));
    }

    if (key == null) {
      throw new Error(
        'If you are using a custom parser, you must provide the configuration file path for SyncFileHandle',
      );
    }

    return new SyncConfigHandle(filePathOrParser, new SyncFileHandle(key));
  }

  #parser: IParser;

  #handle: SyncFileHandle;

  constructor(parser: IParser, handle: SyncFileHandle) {
    this.#parser = parser;
    this.#handle = handle;
  }

  get parser(): Readonly<IParser> {
    return this.#parser;
  }

  read<T>(): T | Error {
    try {
      const buf = this.#handle.read();
      const parsed = this.#parser.parse<T>(buf);
      return parsed;
    } catch (caught) {
      const err = isError(caught, new Error('unknown error raised from read function'));
      return err;
    }
  }

  stringify<T>(data: T) {
    return this.#parser.stringify(data);
  }

  write(data: Buffer | string): boolean | Error {
    try {
      this.#handle.write(data);
      return true;
    } catch (caught) {
      const err = isError(caught, new Error('unknown error raised from write function'));
      return err;
    }
  }
}
