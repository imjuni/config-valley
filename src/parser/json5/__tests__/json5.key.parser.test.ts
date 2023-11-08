import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { Json5KeyParser } from '#/parser/json5/Json5KeyParser';
import { stringify } from 'json5';
import { describe, expect, it } from 'vitest';

const json5Buf = `
// This is JSON5 document.
{
  title: 'application configuration',
  database: {
    host: '192.168.1.1',
    ports: [ 8000, 8001, 8002 ],
    connection_max: 5000,
    enabled: true,
  },
  // MSA coupled API
  apis: {
    user: {
      host: 'https://user.config-valley.com',
      port: '1234',
    },
    product: {
      host: 'https://product.config-valley.com',
      port: '5678',
    },
  }
}
`.trim();

const data = {
  title: 'application configuration',
  database: {
    host: '192.168.1.1',
    ports: [8000, 8001, 8002],
    connection_max: 5000,
    enabled: true,
  },
  apis: {
    users: {
      host: 'https://user.config-valley.com',
      port: '1234',
    },
    products: {
      host: 'https://product.config-valley.com',
      port: '5678',
    },
  },
};

describe('Json5KeyParser', () => {
  it('getter - key', () => {
    const key = 'database';
    const json5KeyParser = new Json5KeyParser(key);

    expect(json5KeyParser.key).toEqual(key);
  });

  it('getter - source', () => {
    const key = 'database';
    const json5KeyParser = new Json5KeyParser(key);

    expect(json5KeyParser.source).toEqual(CE_CONFIG_SOURCE.JSON5);
  });

  it('parse using key, using Buffer', () => {
    const key = 'database';
    const json5KeyParser = new Json5KeyParser(key);
    const parsed = json5KeyParser.parse<{ name: string }>(Buffer.from(json5Buf));

    expect(parsed).toMatchObject(data[key]);
  });

  it('parse using key, using string', () => {
    const key = 'database';
    const json5KeyParser = new Json5KeyParser(key);
    const parsed = json5KeyParser.parse<{ name: string }>(json5Buf);

    expect(parsed).toMatchObject(data[key]);
  });

  it('assign - not support', () => {
    const key = 'database';
    const json5KeyParser = new Json5KeyParser(key);

    expect(() => {
      json5KeyParser.assign({}, {});
    }).toThrowError();
  });

  it('stringify', () => {
    const key = 'database';
    const json5KeyParser = new Json5KeyParser(key);

    json5KeyParser.parse(stringify(data));

    const stringified = json5KeyParser.stringify({ ...data.database, host: '192.168.1.2' });

    expect(stringified).toEqual(
      stringify({ ...data, [key]: { ...data.database, host: '192.168.1.2' } }),
    );
  });
});
