# NestJS 股票热力图服务

一个基于 NestJS 的股票热力图截图服务，支持富途牛牛和大盘云图的热力图获取。

## 功能特性

- 支持富途牛牛（Futu）港股、美股、A股热力图
- 支持行业分类和个股分类两种热力图
- 支持大盘云图的 A 股热力图
- 自动截图并保存
- 防重复任务处理

## 环境要求

- Node.js 16+
- yarn
- Chrome 浏览器 (用于 Puppeteer)

## 安装

```bash
# 安装依赖
$ yarn install
```

## 运行

```bash
# 开发模式
$ yarn run start:dev

# 生产模式
$ yarn run start:prod
```

## API 使用说明

### 富途热力图

GET `/stock-map/futu`

参数：
- `area`: 地区代码 (cn/hk/us)，默认 cn
- `type`: 图表类型 (hy/gu)，默认 gu
  - hy: 行业分类
  - gu: 个股分类

示例：
```
GET /stock-map/futu?area=cn&type=hy
```

### 云图热力图

GET `/stock-map/yuntu`

无需参数，直接获取 A 股热力图

## 文件说明

生成的图片将保存在项目根目录的 `map` 文件夹下：
- 富途热力图：`map/futu-{area}-{type}.png`
- 云图热力图：`map/yuntu.png`
