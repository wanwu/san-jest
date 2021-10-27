/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file utils.js
 * @description 工具
 */

exports.getSanJestConfig = function getSanJestConfig(jestConfig) {
  return (
    (jestConfig &&
      jestConfig.config &&
      jestConfig.config.globals &&
      jestConfig.config.globals["san-jest"]) ||
    {}
  );
};

exports.merge = function (defaultOptions, customOptions) {
  return Object.assign({}, defaultOptions, customOptions);
}