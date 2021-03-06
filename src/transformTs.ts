import typescript from 'typescript';
const babelJest = require('babel-jest').default;

import { getTsJestConfig, getSanJestConfig } from './config';
import {
  ensureRequireModule,
  stripInlineSourceMap,
  getCustomTransformer,
} from './utils';

export default {
  process(scriptContent: string, filePath: string, config: any) {
    ensureRequireModule('typescript', ['typescript']);
    const sanJestConfig = getSanJestConfig(config);
    const tsconfig = getTsJestConfig(config);

    const result = typescript.transpileModule(scriptContent, {
      ...tsconfig,
      fileName: filePath,
    });

    result.outputText = stripInlineSourceMap(result.outputText);

    const inputSourceMap =
      result.sourceMapText !== undefined
        ? JSON.parse(result.sourceMapText)
        : '';

    const customTransformer =
      getCustomTransformer(sanJestConfig['transform'], 'js') || {};
    const transformer = customTransformer.process
      ? customTransformer
      : babelJest.createTransformer({ inputSourceMap });

    return transformer.process(result.outputText, filePath, config);
  },
};
