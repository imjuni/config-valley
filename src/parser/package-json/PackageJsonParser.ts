import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { AbstractJsonKeyParser } from '#/common/parser/AbstractJsonKeyParser';

export class PackageJsonParser extends AbstractJsonKeyParser {
  constructor(key: string) {
    super(CE_CONFIG_SOURCE.PACKAGE_JSON, key);
  }
}
