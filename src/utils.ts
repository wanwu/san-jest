import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { loadPartialConfig } from '@babel/core';

import type { Config } from '@jest/types';

export interface JestConfig {
  config: Config.DefaultOptions;
  [key: string]: any;
}
const constants = require('./constants');

const fetchTransformer = function fetchTransformer(key: string, obj: any) {
  for (const exp in obj) {
    const matchKey = new RegExp(exp);
    if (matchKey.test(key)) {
      return obj[exp];
    }
  }
  return null;
};

export const resolvePath = function resolvePath(pathToResolve: string) {
  return /^(\.\.\/|\.\/|\/)/.test(pathToResolve)
    ? path.resolve(process.cwd(), pathToResolve)
    : pathToResolve;
};

export const info = function info(msg: string) {
  console.info(chalk.blue('\n[san-jest]: ' + msg + '\n'));
};

export const warn = function warn(msg: string) {
  console.warn(chalk.red('\n[san-jest]: ' + msg + '\n'));
};

export const transformContent = function transformContent(
  content: string,
  filePath: string,
  config: JestConfig,
  transformer: any,
  attrs: any
) {
  if (!transformer) {
    return content;
  }
  try {
    return transformer(content, filePath, config, attrs);
  } catch (err) {
    warn(`There was an error while compiling ${filePath} ${err}`);
  }
  return content;
};

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
    compilerOptions: { ...tsConfig.options, target: 'es5', module: 'commonjs' },
  };
};

export function isValidTransformer(transformer: {
  process: (content: string, filePath: string) => string;
  postprocess: (content: string, filePath: string) => string;
  preprocess: (content: string, filePath: string) => string;
}) {
  return (
    isFunction(transformer.process) ||
    isFunction(transformer.postprocess) ||
    isFunction(transformer.preprocess)
  );
}

export const isFunction = (fn: any) => typeof fn === 'function';

export const getCustomTransformer = function getCustomTransformer(
  transform = {},
  lang: string
) {
  transform = { ...constants.defaultsanJestConfig.transform, ...transform };

  const transformerPath = fetchTransformer(lang, transform);

  if (!transformerPath) {
    return null;
  }

  let transformer;
  if (
    typeof transformerPath === 'string' &&
    require(resolvePath(transformerPath))
  ) {
    transformer = require(resolvePath(transformerPath));
  } else if (typeof transformerPath === 'object') {
    transformer = transformerPath;
  }

  if (!isValidTransformer(transformer)) {
    throwError(
      `transformer must contain at least one process, preprocess, or ` +
        `postprocess method`
    );
  }

  return transformer;
};

export const throwError = function error(msg: string) {
  throw new Error('\n[san-jest] Error: ' + msg + '\n');
};

export const stripInlineSourceMap = function (str: string) {
  return str.slice(0, str.indexOf('//# sourceMappingURL'));
};

export const loadSrc = (src: string, filePath: string) => {
  var dir = path.dirname(filePath);
  var srcPath = path.resolve(dir, src);
  try {
    return fs.readFileSync(srcPath, 'utf-8');
  } catch (e) {
    throwError(
      'Failed to load src: "' + src + '" from file: "' + filePath + '"'
    );
    return '';
  }
};

export function ensureRequireModule(name: string, deps: string[]) {
  let i, len;
  let missing = [];
  if (typeof deps === 'string') {
    deps = [deps];
  }
  for (i = 0, len = deps.length; i < len; i++) {
    let mis;
    let req = deps[i];
    if (typeof req === 'string') {
      mis = req;
    } else {
      mis = req[1];
      req = req[0];
    }
    try {
      // hack for babel-runtime because it does not expose "main" field
      if (req === 'babel-runtime') {
        req = 'babel-runtime/core-js';
      }
      require.resolve(req);
    } catch (e) {
      missing.push(mis);
    }
  }
  if (missing.length > 0) {
    let message = 'You are trying to use "' + name + '". ';
    let npmInstall = 'npm install --save-dev ' + missing.join(' ');
    if (missing.length > 1) {
      const last = missing.pop();
      message += missing.join(', ') + ' and ' + last + ' are ';
    } else {
      message += missing[0] + ' is ';
    }
    message += 'missing.\n\nTo install run:\n' + npmInstall;
    throwError(message);
  }
}
