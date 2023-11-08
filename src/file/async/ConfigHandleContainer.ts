import type { IFileReaderContainerParams } from '#/common/interfaces/IFileReaderContainerParams';
import { ConfigHandle } from '#/file/async/ConfigHandle';
import { JsonKeyParser } from '#/parser/json/JsonKeyParser';
import { PackageJsonParser } from '#/parser/package-json/PackageJsonParser';
import { TsconfigJsonParser } from '#/parser/tsconfig-json/TsconfigJsonParser';
import pathe from 'pathe';

export class ConfigHandleContainer {
  #handles: ConfigHandle[];

  #index: number;

  set index(value) {
    this.#index = value;
  }

  get index() {
    return this.#index;
  }

  get handles(): readonly ConfigHandle[] {
    return this.#handles;
  }

  constructor(args?: IFileReaderContainerParams) {
    this.#handles = args?.handles ?? [
      ...(args?.configKey != null
        ? [
            ConfigHandle.factory(
              new JsonKeyParser(args?.configKey),
              pathe.join(process.cwd(), '.configrc'),
            ),
            ConfigHandle.factory(pathe.join(process.cwd(), '.configrc')),
            ConfigHandle.factory(
              new PackageJsonParser(args?.configKey),
              pathe.join(process.cwd(), 'package.json'),
            ),
            ConfigHandle.factory(
              new TsconfigJsonParser(args?.configKey),
              pathe.join(process.cwd(), 'tsconfig.json'),
            ),
          ]
        : [ConfigHandle.factory(pathe.join(process.cwd(), '.configrc'))]),
    ];
    this.#index = Number.MIN_SAFE_INTEGER;
  }

  async read<T>() {
    const config = await this.#handles.reduce(
      async (prevPromise: Promise<T | Error>, reader, index) => {
        const handle = async (prevConfig: T | Error) => {
          if (prevConfig != null && !(prevConfig instanceof Error)) {
            return prevConfig;
          }

          this.#index = index;
          const readed = await reader.read<T>();
          return readed;
        };

        return handle(await prevPromise);
      },
      Promise.resolve<T | Error>(new Error('cannot found configuration')),
    );

    return config;
  }

  async write<T>(data: T) {
    const reader = this.#handles.at(this.#index);

    if (reader == null) {
      throw new Error('please, select reader before writing');
    }

    const stringified = reader.stringify(data);
    const result = await reader.write(stringified);
    return result;
  }
}
