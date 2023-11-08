import type { ConfigHandle } from '#/file/async/ConfigHandle';

export interface IFileReaderContainerParams {
  /** config 파일 또는 package.json 파일, tsconfig.json 파일에서 설정을 추출할 때 어떤 키를 사용할 지 결정합니다. */
  configKey?: string;
  /** 설정 파일을 읽는 handle을 직접 설정할 때 사용합니다 */
  handles?: ConfigHandle[];
}
