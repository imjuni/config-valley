import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { JsoncKeyParser } from '#/parser/json/JsoncKeyParser';
import { describe, expect, it } from 'vitest';

const jsoncBuf = `
// This is JSON5 document.
{
  "title": "application configuration",
  "database": {
    "host": "192.168.1.1",
    "ports": [ 8000, 8001, 8002 ],
    "connection_max": 5000,
    "enabled": true
  },
  // MSA coupled API
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

describe('JsoncKeyParser', () => {
  it('getter - key', () => {
    const key = 'database';
    const jsoncKeyParser = new JsoncKeyParser(key);
    expect(jsoncKeyParser.key).toEqual(key);
  });

  it('getter - source', () => {
    const key = 'database';
    const jsoncKeyParser = new JsoncKeyParser(key);
    expect(jsoncKeyParser.source).toEqual(CE_CONFIG_SOURCE.JSONC);
  });

  it('parse, using Buffer', () => {
    const key = 'database';
    const jsoncKeyParser = new JsoncKeyParser(key);
    const parsed = jsoncKeyParser.parse<{ title: string }>(Buffer.from(jsoncBuf));

    expect(parsed).toMatchObject(data[key]);
  });

  it('parse, using string', () => {
    const key = 'database';
    const jsoncKeyParser = new JsoncKeyParser(key);
    const parsed = jsoncKeyParser.parse<{ title: string }>(jsoncBuf);

    expect(parsed).toMatchObject(data[key]);
  });

  it('assign', () => {
    const key = 'database';
    const jsoncKeyParser = new JsoncKeyParser(key);
    const assigned = jsoncKeyParser.assign<{ title: string }>(data[key], {
      ...data[key],
      host: '192.168.1.2',
    });

    expect(assigned).toMatchObject({ ...data[key], host: '192.168.1.2' });
  });

  it('stringify', () => {
    const key = 'database';
    const jsoncKeyParser = new JsoncKeyParser(key);

    jsoncKeyParser.parse(jsoncBuf);

    const assigned = jsoncKeyParser.assign<{ title: string }>(data[key], {
      ...data[key],
      host: '192.168.1.2',
    });
    const stringified = jsoncKeyParser.stringify(assigned, null, 2);
    const expectData = `
// This is JSON5 document.
{
  "title": "application configuration",
  "database": {
    "host": "192.168.1.2",
    "ports": [
      8000,
      8001,
      8002
    ],
    "connection_max": 5000,
    "enabled": true
  },
  // MSA coupled API
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
}`.trim();
    expect(stringified).toEqual(expectData);
  });
});
