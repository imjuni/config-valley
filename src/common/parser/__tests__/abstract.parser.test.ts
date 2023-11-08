/* eslint-disable max-classes-per-file */
import { CE_CONFIG_SOURCE } from '#/common/const-enum/CE_CONFIG_SOURCE';
import { AbstractJsonKeyParser } from '#/common/parser/AbstractJsonKeyParser';
import { AbstractJsonParser } from '#/common/parser/AbstractJsonParser';
import { describe, expect, it } from 'vitest';

class SampleKeyParser extends AbstractJsonKeyParser {
  constructor() {
    super(CE_CONFIG_SOURCE.PACKAGE_JSON, 'test-key');
  }

  setterTest() {
    this.key = 'my-key';
    this.source = CE_CONFIG_SOURCE.JSON;
  }
}

class SampleParser extends AbstractJsonParser {
  constructor() {
    super(CE_CONFIG_SOURCE.PACKAGE_JSON);
  }

  setterTest() {
    this.source = CE_CONFIG_SOURCE.JSON;
  }
}

describe('AbstractJsonParser', () => {
  it('AbstractJsonParser setter test', () => {
    const sk = new SampleParser();
    sk.setterTest();

    expect(sk.source).toEqual(CE_CONFIG_SOURCE.JSON);
  });

  it('AbstractJsonKeyParser setter test', () => {
    const sk = new SampleKeyParser();
    sk.setterTest();

    expect(sk.key).toEqual('my-key');
    expect(sk.source).toEqual(CE_CONFIG_SOURCE.JSON);
  });
});
