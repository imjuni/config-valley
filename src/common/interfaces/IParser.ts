export interface IParser {
  parse<T>(buf: Buffer | string): T;
  assign<T>(target: object, ...sources: object[]): T;
  stringify(data: unknown): string;
  get source(): string;
}
