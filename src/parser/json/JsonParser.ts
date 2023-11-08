import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { AbstractJsonParser } from '#/common/parser/AbstractJsonParser';

export class JsonParser extends AbstractJsonParser {
  constructor() {
    super(CE_CONFIG_SOURCE.JSON);
  }
}
