import { TsconfigJsonParser } from '#/parser/tsconfig-json/TsconfigJsonParser';
import { describe, expect, it } from 'vitest';

describe('TsconfigJsonParser', () => {
  it('getter - key', () => {
    const key = 'mytool';
    const tsconfigJsonParser = new TsconfigJsonParser(key);

    expect(tsconfigJsonParser.key).toEqual(key);
  });

  it('parse, using Buffer', () => {
    const key = 'mytool';
    const data = `// comment-comment-001\n{\n"mytool": {\n// comment-comment-002\n"name": "test",\n"greeting": {\n"hello": "world"\n}\n}\n}`;
    const tsconfigJsonParser = new TsconfigJsonParser(key);
    const parsed = tsconfigJsonParser.parse<{ name: string }>(Buffer.from(data));

    expect(parsed).toMatchObject({ name: 'test', greeting: { hello: 'world' } });
  });

  it('parse, using string', () => {
    const key = 'mytool';
    const data = { name: 'test' };
    const tsconfigJsonParser = new TsconfigJsonParser(key);
    const parsed = tsconfigJsonParser.parse<{ name: string }>(JSON.stringify({ [key]: data }));

    expect(parsed).toMatchObject(data);
  });

  it('assign', () => {
    const key = 'mytool';
    const data = { name: 'test' };
    const tsconfigJsonParser = new TsconfigJsonParser(key);
    const assigned = tsconfigJsonParser.assign<{ name: string }>(data, { greeting: 'hello' });

    expect(assigned).toMatchObject({ ...data, greeting: 'hello' });
  });

  it('stringify', () => {
    const key = 'mytool';
    const data = { name: 'test' };
    const tsconfigJsonParser = new TsconfigJsonParser(key);
    const stringified = tsconfigJsonParser.stringify(data);

    expect(stringified).toEqual(JSON.stringify({ [key]: data }));
  });
});
