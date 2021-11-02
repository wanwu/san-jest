import { SFCBlock, compileTemplate } from 'san-sfc-compiler';

import { getSanJestConfig } from './config';
import { loadSrc, JestConfig } from './utils';

export default (
  template: SFCBlock | null,
  filename: string,
  config: JestConfig
) => {
  if (!template) {
    return null;
  }
  const sanJestConfig = getSanJestConfig(config);

  if (template.src) {
    template.content = loadSrc(template.src, filename);
  }

  const userOptions = sanJestConfig.templateCompileOptions || {};
  const result = compileTemplate({
    source: template.content,
    filename: filename,
    compileANode: template.attrs.compileANode,
    preprocessLang: template.lang,
    ...userOptions,
  });
  // for template aNode aPack
  result.code = JSON.stringify(result.code);
  result['compileANode'] = template.attrs.compileANode;

  return result;
};
