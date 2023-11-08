import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { AbstractJsonParser } from '#/common/parser/AbstractJsonParser';
import { assign, parse, stringify } from 'comment-json';

export class JsoncParser extends AbstractJsonParser {
  constructor() {
    super(CE_CONFIG_SOURCE.JSONC);
  }

  override parse<T>(buf: Buffer | string): T {
    const stringifiedBuf = typeof buf !== 'string' ? buf.toString() : buf;
    const parsed = parse(stringifiedBuf) as T;
    return parsed;
  }

  override assign<T>(target: object, ...sources: object[]): T {
    return sources.reduce((aggregation, source) => assign(aggregation, source), target) as T;
  }

  override stringify(
    data: unknown,
    replacer?: ((key: string, value: unknown) => unknown) | Array<number | string> | null,
    space?: string | number,
  ): string {
    const stringified = stringify(data, replacer, space);
    return stringified;
  }
}
