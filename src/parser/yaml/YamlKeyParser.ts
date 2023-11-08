import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { AbstractJsonKeyParser } from '#/common/parser/AbstractJsonKeyParser';
import { orThrow } from 'my-easy-fp';
import { parse, stringify } from 'yaml';

export class YamlKeyParser extends AbstractJsonKeyParser {
  constructor(key: string) {
    super(CE_CONFIG_SOURCE.YAML, key);
  }

  override parse<T>(buf: Buffer | string): T {
    const stringifiedBuf = typeof buf !== 'string' ? buf.toString() : buf;
    const parsed = parse(stringifiedBuf) as { [key: string]: T };
    const value = parsed[this.key];

    this.parsed = parsed;

    return orThrow<T>(value, new Error(`Cannot found key: ${this.key}`));
  }

  override assign<T>(_target: object, ..._sources: object[]): T {
    throw new Error(`Not support assign function in ${YamlKeyParser.constructor.name}`);
  }

  override stringify(data: unknown): string {
    const stringified = stringify({
      ...this.parsed,
      [this.key]: data,
    });

    return stringified;
  }
}
