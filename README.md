# san-jest

> san-jest 是一个 .san 文件的 jest 转换器。

项目部分代码来自 [@vue/vue2-jest@27](https://github.com/vuejs/san-jest)

## 使用

首先安装依赖，直接 `npm i` 即可。其中主要有这几个必须的：

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

## 说明

1. 因厂内规范，暂不支持 sass / scss（下次支持）

2. 不支持 scoped css，因为 san-test-utils 无法获取组件生成的 html 中的 css 代码

## 协议

MIT. Copyright (c) Baidu Inc. All rights reserved.
