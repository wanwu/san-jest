# san-jest

> san-jest 是一个 .san 文件的 jest 转换器。

项目部分代码来自 [@vue/vue2-jest@27](https://github.com/vuejs/san-jest)

## 特性

1. 支持 css modules

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
        }
    }
},
```

## 选项

| 方法 / 属性 | 描述                          | 类型    |
| ----------- | ----------------------------- | ------- |
| source      | 源码                          | string  |
| filename    | 文件名                        | string  |
| sourceRoot  | sourcemap 选项                | string  |
| needMap     | sourcemap 开关（template 没有 | boolean |

## 说明

1. 因厂内规范，暂不支持 sass / scss / stylus（有需要再支持）

2. 关于 scoped css，因为 san-test-utils 无法获取组件生成的 html 中的 css 代码，所以测试用例可能无效

## 协议

MIT. Copyright (c) Baidu Inc. All rights reserved.
