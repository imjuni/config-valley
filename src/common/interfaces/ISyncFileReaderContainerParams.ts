import type { SyncConfigHandle } from '#/file/sync/SyncConfigHandle';

export interface ISyncFileReaderContainerParams {
  configKey?: string;
  handles?: SyncConfigHandle[];
}
