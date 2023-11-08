import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { AbstractJsonParser } from '#/common/parser/AbstractJsonParser';
import { parse, stringify } from 'smol-toml';

export class TomlParser extends AbstractJsonParser {
  constructor() {
    super(CE_CONFIG_SOURCE.TOML);
  }

  override parse<T>(buf: Buffer | string): T {
    const stringifiedBuf = typeof buf !== 'string' ? buf.toString() : buf;
    const parsed = parse(stringifiedBuf) as T;
    return parsed;
  }

  override assign<T>(_target: object, ..._sources: object[]): T {
    throw new Error(`Not support assign function in ${TomlParser.constructor.name}`);
  }

  override stringify(data: unknown): string {
    const stringified = stringify(data);
    return stringified;
  }
}
