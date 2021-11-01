import type { Config } from '@jest/types';

export interface TSTransformConfig {}

export interface JestConfig {
  config: Config.DefaultOptions;
  [key: string]: any;
}
