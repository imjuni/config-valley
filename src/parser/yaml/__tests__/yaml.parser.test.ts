import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { YamlParser } from '#/parser/yaml/YamlParser';
import { describe, expect, it } from 'vitest';
import { stringify } from 'yaml';

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

describe('YamlParser', () => {
  it('getter - source', () => {
    const yamlParser = new YamlParser();
    expect(yamlParser.source).toEqual(CE_CONFIG_SOURCE.YAML);
  });

  it('parse, using Buffer', () => {
    const yamlParser = new YamlParser();
    const parsed = yamlParser.parse<{ name: string }>(Buffer.from(yamlBuf));
    expect(parsed).toMatchObject(data);
  });

  it('parse, using string', () => {
    const yamlParser = new YamlParser();
    const parsed = yamlParser.parse<{ name: string }>(yamlBuf);
    expect(parsed).toMatchObject(data);
  });

  it('assign - not support', () => {
    const yamlParser = new YamlParser();

    expect(() => {
      yamlParser.assign({}, {});
    }).toThrowError();
  });

  it('stringify', () => {
    const yamlParser = new YamlParser();
    const stringified = yamlParser.stringify(data);
    expect(stringified).toEqual(stringify(data));
  });
});
