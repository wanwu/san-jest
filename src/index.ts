import crypto from 'crypto';
import { parseSFC } from 'san-sfc-compiler';

const babelJest = require('babel-jest').default;

import processTemplate from './processTemplate';
import processScript from './processScript';
import processStyle from './processStyle';
import generateSourceMap from './sourcemap';
import generateCode from './gencode';

import { JestConfig } from './utils';

export default {
  process: function (src: string, filename: string, config: JestConfig) {
    const descriptor = parseSFC({
      source: src,
      filename,
    });
    const template = descriptor.template;
    const script = descriptor.script;
    const styles = descriptor.styles;

    // process blocks
    const templateResult = processTemplate(template, filename, config);
    const scriptResult = processScript(script, filename, config);
    const stylesResult = processStyle(styles, filename, config);

    // gen runtime code
    const { code } = generateCode(templateResult, scriptResult, stylesResult);

    // generate source map
    const map = generateSourceMap(scriptResult, src, filename).toJSON();

    return {
      code,
      map,
    };
  },
  getCacheKey(
    fileData: string,
    filename: string,
    { config, configString, instrument, rootDir }: any
  ) {
    return crypto
      .createHash('md5')
      .update(
        babelJest.getCacheKey(fileData, filename, {
          config,
          configString,
          instrument,
          rootDir,
        } as any),
        'hex'
      )
      .digest('hex');
  },
};
