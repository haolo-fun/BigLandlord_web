# BigLandlord_web

![毕业设计](https://img.shields.io/badge/-%E6%AF%95%E4%B8%9A%E8%AE%BE%E8%AE%A1-blue) ![npm版本](https://img.shields.io/badge/npm-8.11.0-brightgreen) ![vue版本](https://img.shields.io/badge/vue-2.6.10-brightgreen)

![vue-admin-template](https://img.shields.io/badge/vue--admin--template-4.4.0-yellowgreen) ![element-ui](https://img.shields.io/badge/element--ui-2.13.2-yellowgreen)

## 介绍
这是一个基于spring boot + vue 的房东房屋租赁管理系统

本仓库为项目前端代码，后端代码仓库在[haolo-fun/BigLandlord](https://github.com/haolo-fun/BigLandlord)

- spring security + JWT
- Mysql + Redis
- [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)后台模板
- [knif4j](https://github.com/xiaoymin/knife4j)接口文档
- [Element UI](https://element.eleme.io/#/zh-CN)组件
- [阿里云短信服务](https://dysms.console.aliyun.com/overview)
- [支付宝开放平台](https://developers.alipay.com/)

### 实现功能

- [x] 房源信息管理
- [x] 租客信息管理
- [x] 押金管理
- [x] 租单管理
- [x] 财务管理
- [x] 支付系统

## 演示

[演示地址](https://rent.haolo.fun)

[接口文档地址](https://api.rent.haolo.fun/doc.html)

### 部分截图

![首页](https://raw.githubusercontent.com/haolo-fun/ImageHosting/main/%20BigLandlord/202306061311339.png)
![权限](https://raw.githubusercontent.com/haolo-fun/ImageHosting/main/%20BigLandlord/202306061311836.png)
![租单](https://raw.githubusercontent.com/haolo-fun/ImageHosting/main/%20BigLandlord/202306061313345.png)
![附加费](https://raw.githubusercontent.com/haolo-fun/ImageHosting/main/%20BigLandlord/202306061309231.png)
![财务](https://raw.githubusercontent.com/haolo-fun/ImageHosting/main/%20BigLandlord/202306061313183.png)
![支付](https://raw.githubusercontent.com/haolo-fun/ImageHosting/main/%20BigLandlord/202306061314069.png)

## 配置

#### 开发环境

在.env.development文件中指定后端地址。

```
# just a flag
ENV = 'development'

# base api
VUE_APP_BASE_API = 'http://127.0.0.1:8090'
```

#### 测试环境
在.env.staging文件中指定后端地址。
```
NODE_ENV = production

# just a flag
ENV = 'staging'

# base api
VUE_APP_BASE_API = 'https://《Your IP or Domain》'
```

#### 生产环境

在.env.production文件中指定后端地址。

```
# just a flag
ENV = 'production'

# base api
VUE_APP_BASE_API = 'https://《Your IP or Domain》'
```
## Build Setup

```bash
# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9528

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```
