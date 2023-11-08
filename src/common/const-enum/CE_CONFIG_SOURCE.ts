export const CE_CONFIG_SOURCE = {
  JSON: 'json',
  JSONC: 'jsonc',
  PACKAGE_JSON: 'package-json',
  TSCONFIG_JSON: 'tsconfig-json',
  TOML: 'toml',
  YAML: 'yaml',
  JSON5: 'json5',
} as const;

export type CE_CONFIG_SOURCE = (typeof CE_CONFIG_SOURCE)[keyof typeof CE_CONFIG_SOURCE];
