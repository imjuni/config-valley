import type { IParser } from '#/common/interfaces/IParser';
import { FileHandle } from '#/file/async/FileHandle';
import { JsonParser } from '#/parser/json/JsonParser';
import { isError } from 'my-easy-fp';

export class ConfigHandle {
  static factory(parser: IParser, filePath: string): ConfigHandle;
  static factory(filePath: string): ConfigHandle;
  static factory(filePathOrParser: IParser | string, key?: string): ConfigHandle {
    if (typeof filePathOrParser === 'string') {
      return new ConfigHandle(new JsonParser(), new FileHandle(filePathOrParser));
    }

    if (key == null) {
      throw new Error(
        'If you are using a custom parser, you must provide the configuration file path for FileHandle',
      );
    }

    return new ConfigHandle(filePathOrParser, new FileHandle(key));
  }

  #parser: IParser;

  #handle: FileHandle;

  constructor(parser: IParser, handle: FileHandle) {
    this.#parser = parser;
    this.#handle = handle;
  }

  get parser(): Readonly<IParser> {
    return this.#parser;
  }

  async read<T>(): Promise<T | Error> {
    try {
      const buf = await this.#handle.read();
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

  async write(data: Buffer | string): Promise<boolean | Error> {
    try {
      await this.#handle.write(data);
      return true;
    } catch (caught) {
      const err = isError(caught, new Error('unknown error raised from write function'));
      return err;
    }
  }
}
