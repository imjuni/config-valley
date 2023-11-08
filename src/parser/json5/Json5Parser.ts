import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { AbstractJsonParser } from '#/common/parser/AbstractJsonParser';
import { parse, stringify } from 'json5';

export class Json5Parser extends AbstractJsonParser {
  constructor() {
    super(CE_CONFIG_SOURCE.JSON5);
  }

  override parse<T>(buf: Buffer | string): T {
    const stringifiedBuf = typeof buf !== 'string' ? buf.toString() : buf;
    const parsed = parse<T>(stringifiedBuf);

    return parsed;
  }

  override assign<T>(_target: object, ..._sources: object[]): T {
    throw new Error(`Not support assign function in ${Json5Parser.constructor.name}`);
  }

  override stringify(data: unknown): string {
    const stringified = stringify(data);
    return stringified;
  }
}
