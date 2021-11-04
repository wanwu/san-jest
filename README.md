# san-jest

> san-jest 是一个 .san 文件的 jest 转换器。

项目部分代码来自 [@vue/vue2-jest@27](https://github.com/vuejs/vue-jest)

![test](http://bj.bcebos.com/ibox-thumbnail98/6f13c8cfc46dc1180c7266c93a49cfd4?authorization=bce-auth-v1%2Ffbe74140929444858491fbf2b6bc0935%2F2021-11-04T03%3A16%3A18Z%2F1800%2F%2F8559eccb379dd5aa0cfbf1751bc03692f50e1ae964e12ae1d56b2ad0d3ea1e01)

## 特性

1. 支持 css modules

2. 自定义所有模块的编译选项

3. 目前可以结合 webpack

4. 无硬性依赖

## 使用

首先安装依赖，直接 `npm i` 即可：

```shell
npm i
# or
yarn
```

然后在 package.json 中添加以下字段：

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
      "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
      "^.+\\.san$": "<rootDir>/node_modules/san-jest"
    },
    "globals": {
        "san-jest": {
            "templateCompileOptions": {},
            "styleCompileOptions": {},
            "scriptCompileOptions": {}
        }
    }
},
```

这里有个注意的地方，需要写相对路径 `"^.+\\.san$": "<rootDir>/node_modules/san-jest"` 而不是直接 `san-jest`，覆盖率会统计不到 `.san` 文件。

## 选项

| 方法 / 属性            | 描述                    | 类型   |
| ---------------------- | ----------------------- | ------ |
| templateCompileOptions | san-sfc-compiler 的选项 | Object |
| styleCompileOptions    | 同上                    | Object |
| scriptCompileOptions   | 同上                    | Object |

## 说明

1. sass / scss / stylus 目前支持不完善，它们的 `@import` 语法有可能会有问题

2. 关于 scoped css，因为 san-test-utils 无法获取组件生成的 html 中的 css 代码，所以你的测试用例可能无效

## 协议

MIT. Copyright (c) Baidu Inc. All rights reserved.
