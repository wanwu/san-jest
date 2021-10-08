/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file index.js
 * @description 入口
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
