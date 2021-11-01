import { SFCBlock } from 'san-sfc-compiler';

const babelTransformer = require('babel-jest').default;

import {
  getSanJestConfig,
  loadSrc,
  getCustomTransformer,
  stripInlineSourceMap,
} from './utils';

import type { JestConfig } from './types';

function _processStyle(
  styles: SFCBlock | null,
  filename: string,
  config: JestConfig
) {}

export default (
  styles: SFCBlock[] | null,
  filename: string,
  config: JestConfig
) => {
  if (!styles) {
    return null;
  }

  const filteredStyles = styles
    .filter((style) => style.module)
    .map((style) => ({
      code: _processStyle(style, filename, config),
      moduleName: style.module === true ? '$style' : style.module,
    }));

  return filteredStyles.length ? filteredStyles : null;
};
