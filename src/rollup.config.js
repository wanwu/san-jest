/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file rollup.config.js
 * @description rollup 配置
 */

const path = require("path");
const PostCSS = require("rollup-plugin-postcss");
const SanPlugin = require("rollup-plugin-san");
const typescript = require("rollup-plugin-typescript2");
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("@rollup/plugin-replace");
const image = require("@rollup/plugin-image");
const NodeResolve = require("@rollup/plugin-node-resolve").default;

module.exports = [
  {
    input: ".cache/index.src.js",
    output: {
      exports: "auto",
      file: ".cache/index.dist.js",
      format: "cjs",
      sourcemap: false,
      globals: {
        san: "san",
      },
    },
    plugins: [
      NodeResolve(),
      commonjs({
        browser: true,
      }),
      SanPlugin({
        esModule: true,
      }),
      typescript({
        tsconfig: path.resolve(__dirname, "tsconfig.json"),
      }),
      image(),
      PostCSS(),
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
    ],
    external: ["san"],
  },
];
