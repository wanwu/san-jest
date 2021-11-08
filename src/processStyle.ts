import { SFCBlock, compileStyle } from 'san-sfc-compiler';
const cssExtract = require('extract-from-css');

import { getSanJestConfig } from './config';
import { loadSrc, JestConfig } from './utils';

function extractClassMap(cssCode: string) {
  const cssNames = cssExtract.extractClasses(cssCode);
  const cssMap = {};
  for (let i = 0, l = cssNames.length; i < l; i++) {
    cssMap[cssNames[i]] = cssNames[i];
  }
  return cssMap;
}

function _processStyle(style: SFCBlock, filename: string, config: JestConfig) {
  const sanJestConfig = getSanJestConfig(config);

  if (style.src) {
    style.content = loadSrc(style.src, filename);
  }

  const userOptions = sanJestConfig.styleCompileOptions || {};
  const result = compileStyle({
    source: style.content,
    filename: filename,
    scoped: true,
    preprocessLang: style.lang,
    ...userOptions,
  });

  return JSON.stringify(extractClassMap(result.code));
}

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
    .map((style) => _processStyle(style, filename, config));

  return filteredStyles.length ? filteredStyles : null;
};
