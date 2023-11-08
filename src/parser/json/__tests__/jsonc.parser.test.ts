/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { JsoncParser } from '#/parser/json/JsoncParser';
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

describe('JsoncParser', () => {
  it('getter - source', () => {
    const jsoncParser = new JsoncParser();
    expect(jsoncParser.source).toEqual(CE_CONFIG_SOURCE.JSONC);
  });

  it('parse, using Buffer', () => {
    const jsoncParser = new JsoncParser();
    const parsed = jsoncParser.parse<{ title: string }>(Buffer.from(jsoncBuf));
    expect(parsed).toMatchObject(data);
  });

  it('parse, using string', () => {
    const jsoncParser = new JsoncParser();
    const parsed = jsoncParser.parse<{ title: string }>(jsoncBuf);
    expect(parsed).toMatchObject(data);
  });

  it('assign', () => {
    const jsoncParser = new JsoncParser();
    const assigned = jsoncParser.assign<{ title: string }>(data, {
      database: { host: '192.168.1.2' },
    });

    expect(assigned).toMatchObject({ ...data, database: { host: '192.168.1.2' } });
  });

  it('stringify', () => {
    const jsoncParser = new JsoncParser();
    const parsed = jsoncParser.parse<any>(jsoncBuf);
    const assigned = jsoncParser.assign(parsed, {
      database: jsoncParser.assign(parsed.database, { host: '192.168.1.2' }),
    });
    const stringified = jsoncParser.stringify(assigned, null, 2);

    expect(stringified).toEqual(
      `// This is JSON5 document.
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
}
`.trim(),
    );
  });
});
