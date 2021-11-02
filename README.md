# san-jest

> san-jest 是一个 .san 文件的 jest 转换器。

项目部分代码来自 [@vue/vue2-jest@27](https://github.com/vuejs/vue-jest)

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
        "^.+\\.js$": "babel-jest",
        "^.+\\.san$": "san-jest"
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
