/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file index.js
 * @description 入口
 */

const path = require("path");
const { execSync } = require("child_process");
const fs = require("fs-extra");
const hash = require("hash-sum");

const { getSanJestConfig } = require("./utils");

module.exports = {
  process(_, filename, config) {
    const midname = hash(filename);

    const sanConfig = getSanJestConfig(config);
    const rollupConfig = sanConfig['rollup-config-path'];

    const input = path.join(process.cwd(), `.cache/${midname}.src.js`);
    const output = path.join(process.cwd(), `.cache/${midname}.dist.js`);

    fs.outputFileSync(
      input,
      `import App from '${filename}';export default App;`
    );

    const configPath = rollupConfig
      ? path.resolve(process.cwd(), rollupConfig)
      : path.resolve(__dirname, "rollup.config.js");
    // 同步执行 rollup 
    execSync(`SRC=.cache/${midname}.src.js DIST=.cache/${midname}.dist.js rollup -c ${configPath}`);

    return {
      code: fs.readFileSync(output, "utf-8"),
    };
  },
};
