/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { TomlParser } from '#/parser/toml/TomlParser';
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

describe('TomlParser', () => {
  it('getter - source', () => {
    const tomlParser = new TomlParser();
    expect(tomlParser.source).toEqual(CE_CONFIG_SOURCE.TOML);
  });

  it('parse, using Buffer', () => {
    const tomlParser = new TomlParser();
    const parsed = tomlParser.parse<{ title: string }>(Buffer.from(tomlBuf));
    expect(parsed).toMatchObject(data);
  });

  it('parse, using string', () => {
    const tomlParser = new TomlParser();
    const parsed = tomlParser.parse<{ title: string }>(tomlBuf);
    expect(parsed).toMatchObject(data);
  });

  it('assign - not support', () => {
    const tomlParser = new TomlParser();

    expect(() => {
      tomlParser.assign({}, {});
    }).toThrowError();
  });

  it('stringify', () => {
    const tomlParser = new TomlParser();
    const parsed = tomlParser.parse(tomlBuf) as any;
    parsed.database.host = '192.168.1.2';

    const stringified = tomlParser.stringify(parsed);

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
