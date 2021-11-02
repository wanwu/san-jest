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
    preprocessLang: template.lang,
    ...userOptions,
  });

  return result;
};
