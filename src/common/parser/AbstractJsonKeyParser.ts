import type { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import type { IParser } from '#/common/interfaces/IParser';
import { orThrow } from 'my-easy-fp';

export abstract class AbstractJsonKeyParser implements IParser {
  #key: string;

  #parsed: { [key: string]: unknown };

  #source: CE_CONFIG_SOURCE;

  constructor(source: CE_CONFIG_SOURCE, key: string) {
    this.#key = key;
    this.#source = source;
    this.#parsed = { [this.#key]: undefined };
  }

  get key(): string {
    return this.#key;
  }

  protected set key(value: string) {
    this.#key = value;
  }

  get source() {
    return this.#source;
  }

  protected set source(value) {
    this.#source = value;
  }

  get parsed(): { [key: string]: unknown } {
    return this.#parsed;
  }

  protected set parsed(value: { [key: string]: unknown }) {
    this.#parsed = value;
  }

  /**
   * 파서 함수. Buffer 또는 string 값을 받아서 JSON parse를 한 뒤 돌려준다
   */
  parse<T>(buf: Buffer | string): T {
    const stringifiedBuf = typeof buf !== 'string' ? buf.toString() : buf;
    const parsed = JSON.parse(stringifiedBuf) as { [key: string]: T };
    const value = parsed[this.#key];

    this.#parsed = parsed;

    return orThrow<T>(value, new Error('cannot found key'));
  }

  assign<T>(target: object, ...sources: object[]): T {
    return sources.reduce((aggregation, source) => {
      return { ...aggregation, ...source };
    }, target) as T;
  }

  stringify(data: unknown): string {
    const stringified = JSON.stringify({
      ...this.#parsed,
      [this.#key]: data,
    });

    return stringified;
  }
}
