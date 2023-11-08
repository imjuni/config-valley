import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { JsonKeyParser } from '#/parser/json/JsonKeyParser';
import { describe, expect, it } from 'vitest';

const jsonBuf = `
{
  "title": "application configuration",
  "database": {
    "host": "192.168.1.1",
    "ports": [ 8000, 8001, 8002 ],
    "connection_max": 5000,
    "enabled": true
  },
  "apis": {
    "users": {
      "host": "https://user.config-valley.com",
      "port": 1234
    },
    "products": {
      "host": "https://product.config-valley.com",
      "port": 5678
    }
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
      port: 1234,
    },
    products: {
      host: 'https://product.config-valley.com',
      port: 5678,
    },
  },
};

describe('JsonKeyParser', () => {
  it('getter - key', () => {
    const key = 'database';
    const jsonKeyParser = new JsonKeyParser(key);
    expect(jsonKeyParser.key).toEqual(key);
  });

  it('getter - source', () => {
    const key = 'database';
    const jsonKeyParser = new JsonKeyParser(key);
    expect(jsonKeyParser.source).toEqual(CE_CONFIG_SOURCE.JSON);
  });

  it('parse, using Buffer', () => {
    const key = 'database';
    const jsonKeyParser = new JsonKeyParser(key);
    const parsed = jsonKeyParser.parse<{ title: string }>(Buffer.from(jsonBuf));

    expect(parsed).toMatchObject(data[key]);
  });

  it('parse, using string', () => {
    const key = 'database';
    const jsonKeyParser = new JsonKeyParser(key);
    const parsed = jsonKeyParser.parse<{ title: string }>(Buffer.from(jsonBuf));

    expect(parsed).toMatchObject(data[key]);
  });

  it('assign', () => {
    const key = 'database';
    const jsonKeyParser = new JsonKeyParser(key);
    const assigned = jsonKeyParser.assign<{ title: string }>(data, {
      [key]: { host: '192.168.1.2' },
    });

    expect(assigned).toMatchObject({ ...data, [key]: { host: '192.168.1.2' } });
  });

  it('stringify', () => {
    const key = 'database';
    const jsonKeyParser = new JsonKeyParser(key);

    jsonKeyParser.parse<{ title: string }>(jsonBuf);

    const stringified = jsonKeyParser.stringify(data[key]);

    expect(stringified).toEqual(JSON.stringify(data));
  });
});
