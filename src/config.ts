import { loadPartialConfig } from '@babel/core';
import { JestConfig } from './utils';

export const getSanJestConfig = function getSanJestConfig(
  jestConfig: JestConfig
): any {
  return (
    (jestConfig &&
      jestConfig.config &&
      jestConfig.config.globals &&
      jestConfig.config.globals['san-jest']) ||
    {}
  );
};

export const getBabelOptions = function loadBabelOptions(
  filename: string,
  options = {}
) {
  const opts = Object.assign(options, {
    caller: {
      name: 'san-jest',
      supportsStaticESM: false,
    },
    filename,
    sourceMaps: 'both',
  });
  return loadPartialConfig(opts as any)?.options;
};

export const getTsJestConfig = function getTsJestConfig(config: JestConfig) {
  const { ConfigSet } = require('ts-jest/dist/config/config-set');
  const configSet = new ConfigSet(config.config);
  var tsConfig = configSet.typescript || configSet.parsedTsConfig;
  return {
    compilerOptions: {
      ...tsConfig.options,
      target: 'es5',
      module: 'commonjs',
    },
  };
};
