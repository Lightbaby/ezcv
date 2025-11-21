<div align="center">
<img width="1200" height="475" alt="Career HUD Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🚀 Career HUD - AI 智能简历生成器

[English](#english) | [中文](#中文)

</div>

---

## 中文

### 📖 项目介绍

**Career HUD** 是一个未来感十足的 AI 智能简历生成与管理系统，采用赛博朋克风格设计。通过集成先进的 AI 对话能力，让简历制作变得简单高效。

#### ✨ 核心特性

- 🤖 **AI 智能对话**：通过自然语言与 AI 助手对话，实时修改和优化简历内容
- 🎨 **赛博朋克 UI**：科技感十足的界面设计，支持多种可视化组件
- 📊 **数据可视化**：
  - 技能雷达图：直观展示技能水平
  - 时间轴：清晰呈现职业发展历程
  - 技能节点图：展示技能分类和层级
- 🌐 **多语言支持**：中文/英文自由切换
- 💾 **实时编辑**：支持内联编辑，所见即所得
- 🎯 **智能更新**：AI 可以理解上下文，智能修改简历各个部分
- 📱 **响应式设计**：完美适配桌面和移动设备
- 🖨️ **一键打印**：支持导出为标准简历格式

#### 🛠️ 技术栈

- **前端框架**：React 19 + TypeScript
- **构建工具**：Vite 6.x
- **样式方案**：Tailwind CSS
- **AI 集成**：OpenAI SDK (兼容所有 OpenAI API 格式的服务)
- **图表库**：Recharts
- **图标库**：Lucide React

---

### 🚀 快速开始

#### 📋 前置要求

- Node.js 16.x 或更高版本
- npm 或 yarn 包管理器
- OpenAI API Key（或兼容 OpenAI 格式的 API Key）

#### 📥 安装步骤

1. **克隆项目**
   ```bash
   git clone <your-repo-url>
   cd ezcv
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   
   复制示例配置文件：
   ```bash
   cp env.example .env.local
   ```
   
   编辑 `.env.local` 文件，填入你的 API 配置：
   ```bash
   # 必填：OpenAI API Key
   OPENAI_API_KEY=your_api_key_here
   
   # 可选：API Base URL（默认为 https://api.openai.com/v1）
   # 支持其他兼容 OpenAI 格式的服务，如 Azure OpenAI、自建服务等
   OPENAI_BASE_URL=https://api.openai.com/v1
   
   # 可选：模型名称（默认为 gpt-4o-mini）
   OPENAI_MODEL=gpt-4o-mini
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```
   
   应用将在 `http://localhost:3000` 启动

5. **构建生产版本**
   ```bash
   npm run build
   ```
   
   预览生产构建：
   ```bash
   npm run preview
   ```

---

### 🎮 使用指南

#### 基础操作

1. **编辑个人信息**：点击任何文本区域进行内联编辑
2. **切换语言**：使用右上角的语言切换按钮
3. **打开 AI 助手**：点击右下角的悬浮按钮
4. **与 AI 对话**：
   - 询问问题："介绍一下我的技能"
   - 修改内容："帮我优化个人简介"
   - 添加信息："添加一个新项目经历"

#### AI 命令示例

```
# 更新个人简介
"帮我写一个更专业的个人简介"

# 优化技能描述
"提高 React 技能等级到 95"

# 添加工作经历
"添加一份在 XX 公司的前端开发工作经历"

# 修改项目信息
"优化第一个项目的描述，突出技术亮点"
```

---

### 📦 部署指南

#### Vercel 部署（推荐）

1. **Fork 本项目到你的 GitHub**

2. **在 Vercel 创建新项目**
   - 访问 [Vercel](https://vercel.com)
   - 导入你 Fork 的仓库
   - 配置环境变量：
     ```
     OPENAI_API_KEY=your_key
     OPENAI_BASE_URL=your_base_url (可选)
     OPENAI_MODEL=your_model (可选)
     ```

3. **点击部署**
   - Vercel 会自动检测 Vite 项目
   - 构建命令：`npm run build`
   - 输出目录：`dist`

4. **访问你的应用**
   - 部署完成后，Vercel 会提供一个 URL

#### Netlify 部署

1. **连接 GitHub 仓库**
   - 访问 [Netlify](https://netlify.com)
   - 导入项目

2. **配置构建设置**
   - 构建命令：`npm run build`
   - 发布目录：`dist`
   - 环境变量：添加 `OPENAI_API_KEY` 等

3. **部署**

#### Docker 部署

创建 `Dockerfile`：
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

构建和运行：
```bash
docker build -t career-hud .
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=your_key \
  -e OPENAI_BASE_URL=your_base_url \
  career-hud
```

#### 传统服务器部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **上传 `dist` 目录到服务器**

3. **配置 Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       root /path/to/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **重启 Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

---

### 🔧 自定义配置

#### 修改简历数据

编辑 `metadata.json` 文件来初始化你的简历数据：

```json
{
  "name": "你的姓名",
  "title": "你的职位",
  "bio": "个人简介...",
  "skills": [...],
  "experience": [...],
  "projects": [...]
}
```

#### 自定义主题

在 `index.html` 中修改 Tailwind 配置：

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        hud: {
          accent: '#a3e635', // 修改主题色
          // ...
        }
      }
    }
  }
}
```

---

### 📝 注意事项

1. **API Key 安全**：
   - 不要将 `.env.local` 文件提交到版本控制
   - 生产环境使用环境变量管理 API Key
   - 考虑使用后端代理 API 请求

2. **浏览器兼容性**：
   - 推荐使用 Chrome、Firefox、Safari 最新版本
   - 不支持 IE 浏览器

3. **API 成本**：
   - AI 对话功能会消耗 API 调用额度
   - 建议根据使用频率选择合适的模型
   - `gpt-4o-mini` 性价比最高

---

### 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

---

### 📄 开源协议

本项目采用 MIT 协议，详见 [LICENSE](LICENSE) 文件。

---

### 🙏 致谢

- React Team
- Vite Team
- OpenAI
- Tailwind CSS
- Recharts
- Lucide Icons

---

## English

### 📖 Project Introduction

**Career HUD** is a futuristic AI-powered resume generation and management system with a cyberpunk-style design. It makes resume creation simple and efficient by integrating advanced AI conversational capabilities.

#### ✨ Core Features

- 🤖 **AI Smart Chat**: Modify and optimize resume content in real-time through natural language conversations with AI assistant
- 🎨 **Cyberpunk UI**: Tech-inspired interface design with various visualization components
- 📊 **Data Visualization**:
  - Skills Radar Chart: Intuitively display skill levels
  - Timeline: Clearly present career development journey
  - Skill Node Graph: Show skill categories and hierarchy
- 🌐 **Multi-language Support**: Switch freely between Chinese/English
- 💾 **Real-time Editing**: Support inline editing, WYSIWYG
- 🎯 **Smart Updates**: AI understands context and intelligently modifies resume sections
- 📱 **Responsive Design**: Perfect adaptation for desktop and mobile devices
- 🖨️ **One-click Print**: Export to standard resume format

#### 🛠️ Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6.x
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI SDK (compatible with all OpenAI API format services)
- **Charts**: Recharts
- **Icons**: Lucide React

---

### 🚀 Quick Start

#### 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- OpenAI API Key (or any OpenAI-compatible API Key)

#### 📥 Installation Steps

1. **Clone the project**
   ```bash
   git clone <your-repo-url>
   cd ezcv
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy the example configuration file:
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` file and fill in your API configuration:
   ```bash
   # Required: OpenAI API Key
   OPENAI_API_KEY=your_api_key_here
   
   # Optional: API Base URL (defaults to https://api.openai.com/v1)
   # Supports other OpenAI-compatible services like Azure OpenAI, self-hosted services, etc.
   OPENAI_BASE_URL=https://api.openai.com/v1
   
   # Optional: Model name (defaults to gpt-4o-mini)
   OPENAI_MODEL=gpt-4o-mini
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will start at `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   ```
   
   Preview production build:
   ```bash
   npm run preview
   ```

---

### 🎮 Usage Guide

#### Basic Operations

1. **Edit personal info**: Click any text area for inline editing
2. **Switch language**: Use the language toggle button in the top right corner
3. **Open AI assistant**: Click the floating button in the bottom right corner
4. **Chat with AI**:
   - Ask questions: "Tell me about my skills"
   - Modify content: "Help me optimize my bio"
   - Add information: "Add a new project experience"

#### AI Command Examples

```
# Update bio
"Help me write a more professional bio"

# Optimize skill description
"Increase React skill level to 95"

# Add work experience
"Add a frontend developer position at XX Company"

# Modify project information
"Optimize the description of the first project, highlighting technical highlights"
```

---

### 📦 Deployment Guide

#### Vercel Deployment (Recommended)

1. **Fork this project to your GitHub**

2. **Create a new project on Vercel**
   - Visit [Vercel](https://vercel.com)
   - Import your forked repository
   - Configure environment variables:
     ```
     OPENAI_API_KEY=your_key
     OPENAI_BASE_URL=your_base_url (optional)
     OPENAI_MODEL=your_model (optional)
     ```

3. **Click Deploy**
   - Vercel will automatically detect the Vite project
   - Build command: `npm run build`
   - Output directory: `dist`

4. **Access your app**
   - After deployment, Vercel will provide a URL

#### Netlify Deployment

1. **Connect GitHub repository**
   - Visit [Netlify](https://netlify.com)
   - Import project

2. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables: Add `OPENAI_API_KEY`, etc.

3. **Deploy**

#### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

Build and run:
```bash
docker build -t career-hud .
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=your_key \
  -e OPENAI_BASE_URL=your_base_url \
  career-hud
```

#### Traditional Server Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload `dist` directory to server**

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       root /path/to/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Restart Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

---

### 🔧 Custom Configuration

#### Modify Resume Data

Edit `metadata.json` file to initialize your resume data:

```json
{
  "name": "Your Name",
  "title": "Your Title",
  "bio": "Your bio...",
  "skills": [...],
  "experience": [...],
  "projects": [...]
}
```

#### Customize Theme

Modify Tailwind configuration in `index.html`:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        hud: {
          accent: '#a3e635', // Change theme color
          // ...
        }
      }
    }
  }
}
```

---

### 📝 Important Notes

1. **API Key Security**:
   - Don't commit `.env.local` file to version control
   - Use environment variables for API Key in production
   - Consider using backend proxy for API requests

2. **Browser Compatibility**:
   - Recommended: Latest versions of Chrome, Firefox, Safari
   - Not supported: IE browser

3. **API Costs**:
   - AI chat feature consumes API quota
   - Choose appropriate model based on usage frequency
   - `gpt-4o-mini` offers the best cost-effectiveness

---

### 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork this project
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Submit Pull Request

---

### 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

### 🙏 Acknowledgments

- React Team
- Vite Team
- OpenAI
- Tailwind CSS
- Recharts
- Lucide Icons

---

<div align="center">

**Made with ❤️ and ☕**

如有问题或建议，欢迎提交 Issue | For questions or suggestions, feel free to submit an Issue

</div>
