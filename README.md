# 人生 K 线图 (Life K-Line)

> 📈 **“万般皆是命，半点不由人” —— 但我们可以画出它的 K 线。**

**Life K-Line** 是一个结合了**传统玄学（生辰八字）**与**现代数据可视化（金融 K 线）**的创意 Web 应用。它利用 AI 大模型（如 GLM-4）深度推演用户的一生运势，将其转化为跌宕起伏的 K 线图表，让你以“操盘手”的视角审视自己的人生起伏。

![Project Preview](https://via.placeholder.com/800x400?text=Life+K-Line+Preview) 
*(注：此处可替换为实际的项目截图)*

## ✨ 核心特性

- **🤖 AI 深度推演**：接入智谱 AI (GLM-4) 等大模型，根据生辰八字生成详尽的流年运势，拒绝千篇一律的模板话术。
- **📊 沉浸式 K 线交互**：使用 **ECharts** 绘制专业级 K 线图（蜡烛图），每一根 K 线代表一岁，包含开盘（年初运势）、收盘（年末运势）、最高/最低点。
- **📉 拟真随机性**：告别死板的正弦波，AI 生成的数据模拟真实人生的黑天鹅事件、漫长熊市与黄金牛市，跌宕起伏，扣人心弦。
- **📱 全端适配**：精心设计的响应式 UI，支持桌面端宽屏浏览与移动端竖屏滑动，随时随地查阅“人生大盘”。
- **🛡️ 智能兜底机制**：当 AI 服务不可用时，自动切换至基于 **Random Walk (随机漫步)** 算法的本地推演引擎，确保服务永不掉线。
- **⚙️ 灵活配置**：内置可视化设置面板，支持自定义 API Endpoint、模型名称及 API Key，兼容 OpenAI 格式接口。

## 🛠️ 技术栈

- **前端框架**：[Vue 3](https://vuejs.org/) (Script Setup)
- **开发语言**：[TypeScript](https://www.typescriptlang.org/)
- **构建工具**：[Vite](https://vitejs.dev/)
- **图表库**：[Apache ECharts](https://echarts.apache.org/)
- **样式**：原生 CSS Variables (支持深色/古风主题)

## 🚀 快速开始

### 1. 环境准备
确保你的本地环境已安装 [Node.js](https://nodejs.org/) (推荐 v16+)。

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```
访问 `http://localhost:5173` 即可看到应用。

### 4. 项目构建

```bash
npm run build
```
构建产物将输出至 `dist` 目录。

## ⚙️ 配置说明

项目默认配置了智谱 AI 的接口，但建议使用你自己的 API Key 以获得更稳定的体验。

1. 点击页面右上角的 **设置图标 (⚙)**。
2. 在弹出的面板中配置：
   - **接口地址 (Endpoint)**：例如 `https://open.bigmodel.cn/api/paas/v4/chat/completions`
   - **模型名称 (Model)**：例如 `GLM-4.1V-Thinking-Flash` 或其他兼容模型。
   - **API Key**：你的 API 密钥。
3. 点击“保存配置”，系统会自动将配置存储在本地浏览器的 `localStorage` 中。

## 📂 目录结构

```
life-kline/
├── public/              # 静态资源
├── src/
│   ├── components/      # Vue 组件
│   │   ├── FateBook.vue     # 命书输入面板
│   │   ├── ScrollPanel.vue  # K线画卷展示面板
│   │   └── SettingsModal.vue # 设置弹窗
│   ├── services/        # 业务服务
│   │   └── aiService.ts     # AI 接口封装与流式处理
│   ├── utils/           # 工具函数
│   │   └── divination.ts    # 八字计算与 Random Walk 兜底算法
│   ├── App.vue          # 主应用入口
│   ├── main.ts          # 应用引导
│   └── style.css        # 全局样式与主题变量
├── index.html           # HTML 入口
├── vite.config.ts       # Vite 配置
└── package.json         # 项目依赖配置
```

## 🤝 贡献指南

欢迎提交 Issue 或 Pull Request 来改进这个项目！无论是增加新的占卜算法、优化 K 线视觉效果，还是适配更多的 AI 模型，都非常欢迎。

## 📄 许可证

MIT License
