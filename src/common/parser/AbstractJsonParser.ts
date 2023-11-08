import type { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import type { IParser } from '#/common/interfaces/IParser';

/**
 * JSON 파일 파서 추상화 클래스
 */
export abstract class AbstractJsonParser implements IParser {
  #source: CE_CONFIG_SOURCE;

  constructor(source: CE_CONFIG_SOURCE) {
    this.#source = source;
  }

  get source() {
    return this.#source;
  }

  protected set source(value) {
    this.#source = value;
  }

  parse<T>(buf: Buffer | string): T {
    const stringifiedBuf = typeof buf !== 'string' ? buf.toString() : buf;
    const parsed = JSON.parse(stringifiedBuf) as T;
    return parsed;
  }

  assign<T>(target: object, ...sources: object[]): T {
    return sources.reduce((aggregation, source) => {
      return { ...aggregation, ...source };
    }, target) as T;
  }

  stringify(data: unknown): string {
    const stringified = JSON.stringify(data);
    return stringified;
  }
}
