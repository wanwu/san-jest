import { SFCBlock } from 'san-sfc-compiler';

const babelTransformer = require('babel-jest').default;

import { getSanJestConfig } from './config';
import {
  loadSrc,
  getCustomTransformer,
  stripInlineSourceMap,
  JestConfig,
} from './utils';

function getTransformer(lang = 'js', sanJestConfig: JestConfig) {
  const transformer = getCustomTransformer(sanJestConfig['transform'], lang);
  if (/^typescript$|ts$/.test(lang)) {
    return transformer || require('./transformTs').default;
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

  if (scriptPart.src) {
    scriptPart.content = loadSrc(scriptPart.src, filePath);
  }

  const sanJestConfig = getSanJestConfig(config);
  const transformer = getTransformer(scriptPart.lang, sanJestConfig);

  const result = transformer.process(scriptPart.content, filePath, config);
  result.code = stripInlineSourceMap(result.code);

  return result;
};
