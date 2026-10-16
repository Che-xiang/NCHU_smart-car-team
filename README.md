# 南昌航空大学智能车队（智能车平台）官网 v3

纯静态网页项目：**HTML + CSS + JavaScript，无框架、无构建步骤、无任何网络依赖**（可完全离线运行）。
所有文字与数据集中在 **`js/data.js`** 一个文件里，日常维护只需要改它。

## 文件结构

```
├── index.html            页面结构（通常不用改）
├── css/style.css         全站样式（换主题色改 :root 顶部变量）
├── js/
│   ├── data.js   ★★★ 所有文字、数据都在这里，日常维护改它即可
│   ├── main.js          内容渲染 + 线性图标库（通常不用改）
│   └── effects.js       多层视差 / 星尘 / 进度条（通常不用改）
├── assets/
│   ├── favicon.svg       站点小图标
│   └── images/           图片目录（见 images/README.txt）
└── README.md
```

## 本地预览

双击 `index.html` 用浏览器打开即可；或用 VS Code 的 “Live Server” 插件。

## v3 设计系统（高级感从哪来）

- **克制配色**：近黑底色 + 白 + 单一冰蓝强调色（`--acc: #7dd3fc`），金色只用于年份/勋章点缀
- **叠层排版**：卡片网格奇数/偶数列错位（“叠”的观感）、细线面板、1px 顶部高光
- **多层滚动视差**：带 `data-plx` 属性的元素以不同速率随滚动错层移动——
  `数据属性 data-plx="0.26"`（内容层，移速较快）／`0.06`（赛道层）／`-0.12`（水印编号层）／`-0.10~-0.14`（背景光晕）
  （改数值可调层次速度；删除属性 = 该层静止；手机端与“减少动态效果”下自动停用）
- **线性图标系统**：全站无 emoji，图标为 24px 细线 SVG，data.js 里 `icon` 字段用关键字：
  `plane / book / shield / target / pin / cap / flag / users / spark / camera`
- 板块标题：编号水印（01–08）在内容层之后缓慢移动；FAQ 采用细线编辑风；表格去掉重色块

## 修改内容 = 改 data.js

奖状照片的届次、阶段、组别、队伍和人员分类单独维护在 **`js/honors-data.js`**，详细步骤见 **[竞赛荣誉维护说明](HONORS-GUIDE.md)**。仅上传奖状图片不会自动显示，需同时添加对应记录。

| 位置 | 字段 |
|---|---|
| 队训 / 统计数字 | `hero`（统计在首屏下方细线统计条） |
| 滚动字幕 | `ticker` |
| 关于 / 昌航基因徽章 / 车队名片 | `about`（`genes` 为校史信息，来自学校官网，可保留） |
| 指导老师 / 组别 | `team` |
| 技术方向 | `tech` |
| 荣誉统计 | `honors.chips` |
| 历年赛况 | `competition.rows` |
| 动态（可选配图字段 `img`） | `news` |
| 常见问答 | `faq` |
| 加入我们 / 二维码 | `join`（二维码：`hasImage: true` + 图片路径） |
| 页脚联系方式 | `contact` |
| 示例提示胶囊 | `status.enabled` → `false` |

改完保存 → 重新上传 → GitHub Pages 自动发布（约 1~2 分钟生效）。

## 上线（GitHub Pages，免费）

1. 注册 GitHub 账号（github.com，免费）；
2. 新建仓库（Repository），名字如 `smart-car-team`，选 Public；
3. 把本文件夹全部内容上传到仓库（网页端 Upload files，或 GitHub Desktop）；
4. 仓库 Settings → Pages → Source 选 `Deploy from a branch` → Branch 选 `main` → Save；
5. 等待 1~2 分钟，访问 `https://你的用户名.github.io/smart-car-team/`。

## 上线前必做

- [ ] `js/data.js` 里所有“待补充 / 示例”内容替换为真实信息
- [ ] `status.enabled` 改为 `false`（去掉右上角示例提示）
- [ ] 成绩与证书核对一致；队员/老师照片获得本人同意
- [ ] 校徽如使用，遵循学校标识管理相关规定

