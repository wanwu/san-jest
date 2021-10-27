const path = require("path");
const NodeResolve = require("@rollup/plugin-node-resolve").default;
const PostCSS = require("rollup-plugin-postcss");
const SanPlugin = require("rollup-plugin-san");
const typescript = require("rollup-plugin-typescript2");
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("@rollup/plugin-replace");
const image = require("@rollup/plugin-image");

const pkg = require("./package.json");
const deps = Object.keys(pkg.dependencies).map((key) => ({
  key,
}));

module.exports = [
  {
    input: process.env.SRC,
    output: {
      exports: "auto",
      file: process.env.DIST,
      format: "cjs",
      sourcemap: false,
      globals: deps,
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
    external: Object.keys(pkg.dependencies),
  },
];
