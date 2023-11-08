import { PackageJsonParser } from '#/parser/package-json/PackageJsonParser';
import { describe, expect, it } from 'vitest';

describe('PackageJsonParser', () => {
  it('getter - key', () => {
    const key = 'mytool';
    const fileJsonReader = new PackageJsonParser(key);

    expect(fileJsonReader.key).toEqual(key);
  });

  it('parse using key, using Buffer', () => {
    const key = 'mytool';
    const data = { [key]: { name: 'test' } };
    const fileJsonReader = new PackageJsonParser(key);
    const parsed = fileJsonReader.parse<{ name: string }>(Buffer.from(JSON.stringify(data)));

    expect(parsed).toMatchObject(data[key]);
  });

  it('parse using key, using string', () => {
    const key = 'mytool';
    const data = { [key]: { name: 'test' } };
    const fileJsonReader = new PackageJsonParser(key);
    const parsed = fileJsonReader.parse<{ name: string }>(JSON.stringify(data));

    expect(parsed).toMatchObject(data[key]);
  });

  it('assign', () => {
    const key = 'mytool';
    const data = { name: 'test' };
    const fileJsonReader = new PackageJsonParser(key);
    const assigned = fileJsonReader.assign<{ name: string }>(data, { greeting: 'hello' });

    expect(assigned).toMatchObject({ ...data, greeting: 'hello' });
  });

  it('stringify', () => {
    const key = 'mytool';
    const packageJson = { name: 'config-valley' };
    const data = { tsconfig: 'test' };
    const packageJsonParser = new PackageJsonParser(key);
    packageJsonParser.parse(JSON.stringify({ ...packageJson, [key]: data }));

    const stringified = packageJsonParser.stringify(data);

    expect(stringified).toEqual(JSON.stringify({ ...packageJson, [key]: data }));
  });
});
