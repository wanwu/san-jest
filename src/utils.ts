import path from 'path';
import fs from 'fs';

import type { Config } from '@jest/types';

export interface JestConfig {
  config: Config.DefaultOptions;
  [key: string]: any;
}

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
    throwError(`There was an error while compiling ${filePath} ${err}`);
  }
  return content;
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
  const dir = path.dirname(filePath);
  const srcPath = path.resolve(dir, src);
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
