# san-jest

san-jest 是一个 .san 文件的 jest 转换器。

## 使用

首先安装依赖，直接 `npm i` 即可。其中主要有这几个必须的：

```shell
npm i san san-jest san-test-utils jest @babel/core babel-jest
```

其他的可以根据需要自行安装

然后在package.json中添加以下字段：

```json
"jest": {
    "testEnvironment": "jsdom",
    "moduleFileExtensions": [
        "js",
        "ts",
        "json",
        "san"
    ],
    "transform": {
        "^.+\\.js$": "babel-jest",
        "^.+\\.san$": "san-jest"
    },
    "globals": {
        "san-jest": {
            "rollup-config-path": "custom.config.js"
        }
    }
},
```

如上所示，首先需要配置 jest 根据正则调用不同的转换器，然后配置自定义 rollup 的配置文件。因为默认的配置不一定能满足你的需要。

接下来看 rollup 配置文件的内容：

```js
{
    input: ".cache/index.src.js",
    output: {
        exports: "auto",
        file: ".cache/index.dist.js",
        format: "cjs",
        sourcemap: false,
        globals: {
            // ...
        },
    },
    plugins: [
        // ...
        SanPlugin({
            esModule: true,
        }),
        // ...
    ],
    external: {
        // ...
    }
},
```

input 和 output 一般不需要动，主要是 globals 和 external，其次是 plugins。前者定义了 iife 中的参数以及转换后的 js 中的 require 的包，后者根据需要自定义，示例中基本都是必备的插件。

具体可参考 test 目录下的配置文件和测试用例。

rollup-plugin-san 用法可以参考这个[链接](https://github.com/wanwu/rollup-plugin-san)

## 注意

你可能需要手动在 rollup config 文件中的 output.globals 字段添加全局引入的外部包，这样能保证所需要的包能直接引入，因为 jest transformer 要求返回的是一个 iife

## 协议

MIT. Copyright (c) Baidu Inc. All rights reserved.
