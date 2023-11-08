import type { ISyncFileReaderContainerParams } from '#/common/interfaces/ISyncFileReaderContainerParams';
import { SyncConfigHandle } from '#/file/sync/SyncConfigHandle';
import { JsonKeyParser } from '#/parser/json/JsonKeyParser';
import { PackageJsonParser } from '#/parser/package-json/PackageJsonParser';
import { TsconfigJsonParser } from '#/parser/tsconfig-json/TsconfigJsonParser';
import pathe from 'pathe';

export class SyncConfigHandleContainer {
  #handles: SyncConfigHandle[];

  #index: number;

  set index(value) {
    this.#index = value;
  }

  get index() {
    return this.#index;
  }

  get handles(): readonly SyncConfigHandle[] {
    return this.#handles;
  }

  constructor(args?: ISyncFileReaderContainerParams) {
    this.#handles = args?.handles ?? [
      ...(args?.configKey != null
        ? [
            SyncConfigHandle.factory(
              new JsonKeyParser(args.configKey),
              pathe.join(process.cwd(), '.configrc'),
            ),
            SyncConfigHandle.factory(pathe.join(process.cwd(), '.configrc')),
            SyncConfigHandle.factory(
              new PackageJsonParser(args.configKey),
              pathe.join(process.cwd(), 'package.json'),
            ),
            SyncConfigHandle.factory(
              new TsconfigJsonParser(args.configKey),
              pathe.join(process.cwd(), 'tsconfig.json'),
            ),
          ]
        : [SyncConfigHandle.factory(pathe.join(process.cwd(), '.configrc'))]),
    ];
    this.#index = Number.MIN_SAFE_INTEGER;
  }

  read<T>() {
    for (let i = 0; i < this.#handles.length; i += 1) {
      this.#index = i;
      const readed = this.#handles[i]?.read<T>();

      if (readed != null && !(readed instanceof Error)) {
        return readed;
      }
    }

    return new Error('cannot found configuration');
  }

  async write<T>(data: T) {
    const reader = this.#handles.at(this.#index);

    if (reader == null) {
      throw new Error('please, select reader before writing');
    }

    const stringified = reader.stringify(data);
    const result = reader.write(stringified);
    return result;
  }
}
