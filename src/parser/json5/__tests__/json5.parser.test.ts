import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { Json5Parser } from '#/parser/json5/Json5Parser';
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
    users: {
      host: 'https://user.config-valley.com',
      port: '1234',
    },
    products: {
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

describe('Json5Parser', () => {
  it('getter - source', () => {
    const fileJsonReader = new Json5Parser();
    expect(fileJsonReader.source).toEqual(CE_CONFIG_SOURCE.JSON5);
  });

  it('parse using key, using Buffer', () => {
    const json5Parser = new Json5Parser();
    const parsed = json5Parser.parse<{ host: string }>(Buffer.from(json5Buf));
    expect(parsed).toMatchObject(data);
  });

  it('parse using key, using string', () => {
    const json5Parser = new Json5Parser();
    const parsed = json5Parser.parse<{ host: string }>(stringify(data));

    expect(parsed).toMatchObject(data);
  });

  it('assign - not support', () => {
    const json5Parser = new Json5Parser();

    expect(() => {
      json5Parser.assign({}, {});
    }).toThrowError();
  });

  it('stringify', () => {
    const json5Parser = new Json5Parser();

    json5Parser.parse(stringify(data));

    const expectData = { ...data, database: { ...data.database, host: '192.168.1.2' } };
    const stringified = json5Parser.stringify(expectData);

    expect(stringified).toEqual(stringify(expectData));
  });
});
