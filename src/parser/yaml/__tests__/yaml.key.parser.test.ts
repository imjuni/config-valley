import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { YamlKeyParser } from '#/parser/yaml/YamlKeyParser';
import { describe, expect, it } from 'vitest';

const yamlBuf = `
# This is YAML document.

title: application configuration
database:
  host: 192.168.1.1
  ports:
  - 8000
  - 8001
  - 8002
  connection_max: 5000
  enabled: true
apis:
  users:
    host: https://user.config-valley.com
    port: 1234
  products:
    host: https://product.config-valley.com
    port: 5678
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

describe('YamlKeyParser', () => {
  it('getter - key', () => {
    const key = 'database';
    const yamlKeyParser = new YamlKeyParser(key);
    expect(yamlKeyParser.key).toEqual(key);
  });

  it('getter - source', () => {
    const key = 'database';
    const yamlKeyParser = new YamlKeyParser(key);
    expect(yamlKeyParser.source).toEqual(CE_CONFIG_SOURCE.YAML);
  });

  it('parse, using Buffer', () => {
    const key = 'database';
    const yamlKeyParser = new YamlKeyParser(key);
    const parsed = yamlKeyParser.parse<{ title: string }>(Buffer.from(yamlBuf));
    expect(parsed).toMatchObject(data[key]);
  });

  it('parse, using string', () => {
    const key = 'database';
    const yamlKeyParser = new YamlKeyParser(key);
    const parsed = yamlKeyParser.parse<{ title: string }>(yamlBuf);

    expect(parsed).toMatchObject(data[key]);
  });

  it('assign - not support', () => {
    const key = 'database';
    const yamlKeyParser = new YamlKeyParser(key);

    expect(() => {
      yamlKeyParser.assign({}, {});
    }).toThrowError();
  });

  it('stringify', () => {
    const key = 'database';
    const yamlKeyParser = new YamlKeyParser(key);

    yamlKeyParser.parse<{ title: string }>(yamlBuf);

    const stringified = yamlKeyParser.stringify({ ...data.database, host: '192.168.1.2' });

    const expectData = `
title: application configuration
database:
  host: 192.168.1.2
  ports:
    - 8000
    - 8001
    - 8002
  connection_max: 5000
  enabled: true
apis:
  users:
    host: https://user.config-valley.com
    port: 1234
  products:
    host: https://product.config-valley.com
    port: 5678
`.trim();

    expect(stringified).toEqual(`${expectData}\n`);
  });
});
