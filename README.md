# 南昌航空大学智能车队（智能车平台）官网

HTML、CSS 与原生 JavaScript 构成的静态站点，无框架、包管理或构建步骤。源代码仓库：[Che-xiang/NCHU_smart-car-team](https://github.com/Che-xiang/NCHU_smart-car-team)。

主要内容和图片由站点本地文件提供，字体使用系统字体栈。公开留言通过 GitHub API 读取带有 `guestbook-approved` 标签的 Issues；提交留言会打开 GitHub 的 Issue 创建页，由访客确认并发布。因此，留言功能需要网络及相应的 GitHub 访问权限。

## 本地预览

在项目根目录运行：

```sh
python3 -m http.server 8000
```

浏览器打开 `http://localhost:8000`。直接打开 `index.html` 可浏览主要静态内容；HTTP 预览更接近实际托管环境。

## 文件结构与职责

| 文件 | 职责 |
|---|---|
| `index.html` | 页面结构、首页内容入口、活动图库与共享页脚 |
| `css/style.css` | 基础样式、布局、原有组件与图片查看器 |
| `css/honors.css` | 荣誉档案与证书查看器 |
| `css/theme.css` | 日间主题及主题切换控件的基础样式 |
| `css/refinement.css` | 最后加载的视觉调整、最终主题变量与响应式规则 |
| `js/data.js` | 常规内容、技术组别、作品、动态、问答、招新与联系方式 |
| `js/honors-data.js` | 证书档案的届次及逐张证书记录 |
| `js/main.js` | 内容渲染、整版导航、移动菜单和 GitHub 留言 |
| `js/honors.js` | 荣誉档案筛选、搜索与证书查看 |
| `js/interactions.js` | 技术及介绍详情、图片浏览交互 |
| `js/theme.js` | 首次绘制前选择主题、切换主题与保存偏好 |
| `js/effects.js` | 页面辅助动效；无对应元素时不启用相关效果 |
| `assets/images/` | 作品、活动及证书图片 |
| `DESIGN.md` | 从当前实现提取的视觉规范与基础令牌 |
| `.impeccable/design.json` | 组件预览、动效、断点等补充信息 |

样式按 `style.css → honors.css → theme.css → refinement.css` 的顺序加载。维护当前配色、排版或响应式规则时，先查看最后一份样式表及选择器优先级，避免仅修改已被覆盖的旧声明。

## 内容维护

| 内容 | 维护位置 |
|---|---|
| 队训、统计数字 | `js/data.js` 的 `hero` |
| 车队介绍、校史信息、名片 | `about` |
| 组织架构、技术方向 | `team`、`tech` |
| 作品、学习路径、准备活动图片 | `featuredProjects`、`learningPath`、`preparationGallery` |
| 荣誉摘要、历年赛况 | `honors`、`competition` |
| 动态、常见问答 | `news`、`faq` |
| 招新说明、二维码、联系方式 | `join`、`contact` |
| 页脚车队自建网站说明 | `status`；`enabled` 控制显示 |
| 证书分类与图片路径 | `js/honors-data.js`，详见 [竞赛荣誉维护说明](HONORS-GUIDE.md) |
| 首页固定文案、首页主图、活动图库 | `index.html` |

`ticker` 保留在配置中；当前首页没有滚动字幕容器。新增图片时同时维护对应路径和说明；仅上传证书图片不会自动新增档案记录。

## 页面与主题

导航使用 `#home`、`#tech` 等 URL 片段切换整版内容，支持浏览器前进、后退；共享页脚位于页面切换容器之外。移动菜单在宽度不超过 1080px 时启用，窄屏内容在 760px 及以下进一步重排。

主题首次跟随系统偏好；手动切换后将选择保存在 `localStorage` 的 `nchu-theme` 项。无法访问本地存储时仍可切换。减少动态效果偏好会停用 CSS 动画与过渡。

## 发布与检查

将源文件更新到仓库后，通过仓库现有 GitHub Pages 配置发布。发布目录必须保留 `index.html` 与 `css/`、`js/`、`assets/` 的相对路径；不需要编译。

内容更新后检查日间和夜间模式、手机导航、详情返回、图片查看与留言提示，并核对证书、数据和联系方式。样式或脚本变化时，同步更新 `index.html` 内对应资源的版本查询参数，便于浏览器获取新版本。
