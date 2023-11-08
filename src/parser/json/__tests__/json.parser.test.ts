import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { JsonParser } from '#/parser/json/JsonParser';
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

describe('JsonParser', () => {
  it('getter - source', () => {
    const jsonParser = new JsonParser();
    expect(jsonParser.source).toEqual(CE_CONFIG_SOURCE.JSON);
  });

  it('parse, using Buffer', () => {
    const jsonParser = new JsonParser();
    const parsed = jsonParser.parse<{ title: string }>(Buffer.from(jsonBuf));
    expect(parsed).toMatchObject(data);
  });

  it('parse, using string', () => {
    const jsonParser = new JsonParser();
    const parsed = jsonParser.parse<{ title: string }>(jsonBuf);
    expect(parsed).toMatchObject(data);
  });

  it('assign', () => {
    const jsonParser = new JsonParser();
    const assigned = jsonParser.assign<{ title: string }>(data, {
      database: { host: '192.168.1.2' },
    });

    expect(assigned).toMatchObject({
      ...data,
      database: { host: '192.168.1.2' },
    });
  });

  it('stringify', () => {
    const jsonParser = new JsonParser();
    const stringified = jsonParser.stringify(data);
    expect(stringified).toEqual(JSON.stringify(data));
  });
});
