/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { TomlKeyParser } from '#/parser/toml/TomlKeyParser';
import { describe, expect, it } from 'vitest';

const tomlBuf = `
# This is a TOML document.

title = "application configuration"

[database]
host = "192.168.1.1"
ports = [ 8000, 8001, 8002 ]
connection_max = 5000
enabled = true

[apis]

  # Indentation (tabs and/or spaces) is allowed but not required
  [apis.users]
  host = "https://user.config-valley.com"
  port = 1234

  [apis.products]
  host = "https://product.config-valley.com"
  port = 5678
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

describe('TomlKeyParser', () => {
  it('getter - key', () => {
    const key = 'database';
    const tomlKeyParser = new TomlKeyParser(key);
    expect(tomlKeyParser.key).toEqual(key);
  });

  it('getter - source', () => {
    const key = 'database';
    const tomlKeyParser = new TomlKeyParser(key);
    expect(tomlKeyParser.source).toEqual(CE_CONFIG_SOURCE.TOML);
  });

  it('parse, using Buffer', () => {
    const key = 'database';
    const tomlKeyParser = new TomlKeyParser(key);
    const parsed = tomlKeyParser.parse<{ name: string }>(Buffer.from(tomlBuf));
    expect(parsed).toMatchObject(data[key]);
  });

  it('parse, using string', () => {
    const key = 'database';
    const tomlKeyParser = new TomlKeyParser(key);
    const parsed = tomlKeyParser.parse<{ name: string }>(tomlBuf);
    expect(parsed).toMatchObject(data[key]);
  });

  it('assign - not support', () => {
    const key = 'database';
    const tomlKeyParser = new TomlKeyParser(key);

    expect(() => {
      tomlKeyParser.assign({}, {});
    }).toThrowError();
  });

  it('stringify', () => {
    const key = 'database';
    const tomlKeyParser = new TomlKeyParser(key);
    const parsed = tomlKeyParser.parse(tomlBuf) as any;
    parsed.host = '192.168.1.2';

    const stringified = tomlKeyParser.stringify(parsed);

    const expectData = `
title = "application configuration"

[database]
host = "192.168.1.2"
ports = [ 8000, 8001, 8002 ]
connection_max = 5000
enabled = true

[apis]
[apis.users]
host = "https://user.config-valley.com"
port = 1234

[apis.products]
host = "https://product.config-valley.com"
port = 5678
`.trim();

    expect(stringified).toEqual(expectData);
  });
});
