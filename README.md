# config-valley

![ts](https://flat.badgen.net/badge/Built%20With/TypeScript/blue)
[![Download Status](https://img.shields.io/npm/dw/config-valley.svg)](https://npmcharts.com/compare/config-valley?minimal=true)
[![Github Star](https://img.shields.io/github/stars/imjuni/config-valley.svg?style=popout)](https://github.com/imjuni/config-valley)
[![Github Issues](https://img.shields.io/github/issues-raw/imjuni/config-valley.svg)](https://github.com/imjuni/config-valley/issues)
[![NPM version](https://img.shields.io/npm/v/config-valley.svg)](https://www.npmjs.com/package/config-valley)
[![License](https://img.shields.io/npm/l/config-valley.svg)](https://github.com/imjuni/config-valley/blob/master/LICENSE)
[![ci](https://github.com/imjuni/config-valley/actions/workflows/ci.yml/badge.svg)](https://github.com/imjuni/config-valley/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/imjuni/config-valley/branch/master/graph/badge.svg?token=DADV7ss5bh)](https://codecov.io/gh/imjuni/config-valley)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

`config-valley` is a simple and easy-to-use utility for reading configuration from various sources. When developing CLI utilities, it may be necessary to read configuration from files like `package.json` or `tsconfig.json` to enhance user convenience. config-valley allows you to consistently read configuration from various formats, such as JSON, JSONC, JSON5, YAML, and TOML, using DI (Dependency Injection).

 1. Supports JSON, JSONC, JSON5, YAML, and TOML.
 2. Customizable configuration reading through DI.

Enhance the convenience of your CLI utility by using config-valley!

## installation

```bash
# npm
npm install config-valley --save

# yarn
yarn install config-valley --save

# pnpm
pnpm add config-valley --save
```

## Usage

![architecture](media/di-architecture.png)

`config-valley` has an architecture as shown in the diagram. It includes the FileHandle class for reading configuration files (including package.json and tsconfig.json), and various implementations of the `IParser` interface such as JSONParser, JSON5Parser, PackageJsonParser, TsconfigParser, TomlParser, and YamlParser. The `ConfigHandle` class contains both a FileHandle and an IParser, while the `ConfigHandleContainer` holds multiple `ConfigHandle` instances.

When using `config-valley`, you pass an array of `ConfigHandle` instances to the `ConfigHandleContainer`. See the example below:

```ts
import pathe from 'pathe';
import { 
  ConfigHandleContainer, 
  ConfigHandle,
  JsonKeyParser,
  PackageJsonParser,
  TsconfigJsonParser
} from 'config-valley';

function getConfigHandle() {
  const filename = 'your configuration file name, for example, .appconfig';
  const keyname = 'key name for extract configuration from package.json or tsconfig.json';

  const handle = new ConfigHandleContainer({
    handles: [
      // extract configuration from config file using keyname
      ConfigHandle.factory(
        new JsonKeyParser(keyname),
        pathe.join(process.cwd(), filename),
      ),
      // read configuration from config file
      ConfigHandle.factory(pathe.join(process.cwd(), filename)),
      // extract configuration from package.json using keyname
      ConfigHandle.factory(
        new PackageJsonParser(keyname),
        pathe.join(process.cwd(), 'package.json'),
      ),
      // extract configuration from tsconfig.json using keyname
      ConfigHandle.factory(
        new TsconfigJsonParser(keyname),
        pathe.join(process.cwd(), 'tsconfig.json'),
      ),
    ]
  });

  return handle;
}

const handle = getConfigHandle();
const config = await handle.read();

// show your configuration
console.log(config);

// change configuration
config.output = 'mytools/dist'

// save your configuration
await container.write(config)
```

## How can I read various configuration formats?

config-valley reads configuration files using various parsers that implement the IParser interface. The FileHandle reads the configuration file, and the IParser implementation parses the read buffer. The ConfigHandle combines these two. The ConfigHandleContainer holds multiple ConfigHandle instances in an array. Finally, the ConfigHandleContainer reads the configuration files sequentially until successful.

## Synchronous vs Asynchronous

You can use `SyncConfigHandle` and `SyncConfigHandleContainer`, or `ConfigHandle` and `ConfigHandleContainer`, depending on your needs. They have the same usage, but the `FileHandle` and `IParser` implementations must be developed specifically for synchronous or asynchronous use.

## Support formats

`config-valley` supports `JSON`, `JSONC`, `JSON5`, `YAML`, and `TOML`. When reading configuration from `package.json` or `tsconfig.json`, you need to extract the configuration from a specific key. This method is also supported for other file formats. In such cases, you can use `Json5KeyParser`, `YamlKeyParser`, or `TomlKeyParser` to extract the configuration by specifying a key in the input file.

```ts
function getConfigHandle() {
  const filename = 'your configuration file name, for example, .appconfig';

  const handle = new ConfigHandleContainer({
    handles: [
      ConfigHandle.factory(
        new TomlKeyParser(args?.configKey),
        pathe.join(process.cwd(), filename),
      ),
    ]
  });

  return handle;
}
```

| Class Name | Usage |
| :- | :- |
| JSONParser | The JSONParser class parses JSON format files. |
| JSONKeyParser | The JSONKeyParser class parses JSON format files and extracts configuration from a specific key. |
| JSONCParser | The JSONCParser class parses JSON with Comments format files. |
| JSONCKeyParser | The JSONCKeyParser class parses JSON with Comments format files and extracts configuration from a specific key. |
| JSON5Parser | The JSON5Parser class parses JSON5 format files. |
| JSON5KeyParser | The JSON5KeyParser class parses JSON5 format files and extracts configuration from a specific key. |
| YamlParser | The YamlParser class parses YAML format files. |
| YamlKeyParser | The YamlKeyParser class parses YAML format files and extracts configuration from a specific key. |
| TomlParser | The TomlParser class parses TOML format files. |
| TomlKeyParser | The TomlKeyParser class parses TOML format files and extracts configuration from a specific key. |
| PackageJsonParser | The PackageJsonParser class parses package.json files and extracts configuration from a specific key. |
| TsconfigJsonParser | The TsconfigJsonParser class parses tsconfig.json files and extracts configuration from a specific key. |

## License

This software is licensed under the [MIT](LICENSE).
