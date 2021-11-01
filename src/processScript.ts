import { SFCBlock } from 'san-sfc-compiler';

const babelTransformer = require('babel-jest').default;

import {
  getSanJestConfig,
  loadSrc,
  getCustomTransformer,
  stripInlineSourceMap,
} from './utils';

import type { JestConfig } from './types';

function getTransformer(lang = 'js', sanJestConfig: JestConfig) {
  const transformer = getCustomTransformer(sanJestConfig['transform'], lang);
  if (/^typescript$|ts$/.test(lang)) {
    return transformer || require('./transformTs');
  } else {
    return transformer || babelTransformer;
  }
}

export default (
  scriptPart: SFCBlock | null,
  filePath: string,
  config: JestConfig
) => {
  if (!scriptPart) {
    return null;
  }

  let externalSrc = null;
  if (scriptPart.src) {
    scriptPart.content = loadSrc(scriptPart.src, filePath);
    externalSrc = scriptPart.content;
  }

  const sanJestConfig = getSanJestConfig(config);
  const transformer = getTransformer(scriptPart.lang, sanJestConfig);

  const result = transformer.process(scriptPart.content, filePath, config);
  result.code = stripInlineSourceMap(result.code);
  result.externalSrc = externalSrc;
  
  return result;
};
