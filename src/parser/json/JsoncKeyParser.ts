import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { AbstractJsonKeyParser } from '#/common/parser/AbstractJsonKeyParser';
import { assign, parse, stringify } from 'comment-json';
import { orThrow } from 'my-easy-fp';

export class JsoncKeyParser extends AbstractJsonKeyParser {
  constructor(key: string) {
    super(CE_CONFIG_SOURCE.JSONC, key);
  }

  override parse<T>(buf: Buffer | string): T {
    const stringifiedBuf = typeof buf !== 'string' ? buf.toString() : buf;
    const parsed = parse(stringifiedBuf) as unknown as { [key: string]: T };
    const value = parsed[this.key];

    this.parsed = parsed;

    return orThrow<T>(value, new Error(`cannot found key: ${this.key}`));
  }

  override assign<T>(target: object, ...sources: object[]): T {
    return sources.reduce((aggregation, source) => assign(aggregation, source), target) as T;
  }

  override stringify(
    data: unknown,
    replacer?: ((key: string, value: unknown) => unknown) | Array<number | string> | null,
    space?: string | number,
  ): string {
    const stringified = stringify(this.assign(this.parsed, { [this.key]: data }), replacer, space);

    return stringified;
  }
}
