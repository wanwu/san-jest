import { SFCBlock, compileTemplate } from 'san-sfc-compiler';

import { getSanJestConfig, loadSrc } from './utils';

import type { JestConfig } from './types';

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
    preprocessOptions: sanJestConfig[template.lang as string],
    ...userOptions,
  });

  return result;
};
