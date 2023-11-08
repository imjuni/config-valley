import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { AbstractJsonKeyParser } from '#/common/parser/AbstractJsonKeyParser';
import { parse, stringify } from 'json5';
import { orThrow } from 'my-easy-fp';

export class Json5KeyParser extends AbstractJsonKeyParser {
  constructor(key: string) {
    super(CE_CONFIG_SOURCE.JSON5, key);
  }

  override parse<T>(buf: Buffer | string): T {
    const stringifiedBuf = typeof buf !== 'string' ? buf.toString() : buf;
    const parsed = parse<{ [key: string]: T }>(stringifiedBuf);
    const value = parsed[this.key];

    super.parsed = parsed;

    return orThrow<T>(value, new Error(`Cannot found key: ${this.key}`));
  }

  override assign<T>(_target: object, ..._sources: object[]): T {
    throw new Error(`Not support assign function in ${Json5KeyParser.constructor.name}`);
  }

  override stringify(data: unknown): string {
    const stringified = stringify({
      ...super.parsed,
      [this.key]: data,
    });

    return stringified;
  }
}
