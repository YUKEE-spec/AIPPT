<div align="center">

<img width="256" src="https://github.com/user-attachments/assets/6f9e4cf9-912d-4faa-9d37-54fb676f547e">

# 🍌 TYQ定制版 · AI PPT

*Vibe your PPT like vibing code.*

**中文 | [English](README_EN.md)**

<p>

[![Version](https://img.shields.io/badge/version-v0.2.0--custom-FF6B6B.svg)](https://github.com/YUKEE-spec/AIPPT)
![Docker](https://img.shields.io/badge/Docker-Build-2496ED?logo=docker&logoColor=white)
[![License](https://img.shields.io/github/license/Anionex/banana-slides?color=FFD54F)](https://github.com/Anionex/banana-slides/blob/main/LICENSE)

</p> 

<b>基于 <a href="https://github.com/Anionex/banana-slides">Banana Slides</a> 开源项目的定制增强版本</b>

<b>🎯 降低PPT制作门槛，让每个人都能快速创作出美观专业的演示文稿</b>

</div>

---

## 🚀 定制版特性

本版本在原版 Banana Slides 基础上新增了以下特性：

### ⚙️ 1. 多API配置管理
- **多服务商支持**：支持 Google Gemini、OpenAI、通义千问、百度文心、DeepSeek 等多种 AI 服务
- **快速配置向导**：首次使用时提供分步引导，轻松完成 API 配置
- **灵活切换**：可随时在不同 API 服务商之间切换，支持自定义 OpenAI 兼容接口
- **配置导入导出**：支持配置文件的导入导出，方便备份和迁移

### 📝 2. 结构化PPT需求输入
- **表单化输入**：通过结构化表单输入 PPT 主题、受众、风格等信息
- **智能提示**：根据输入内容自动生成优化的 AI 提示词
- **需求模板**：预设多种常见场景模板，快速开始创作

### 🔄 3. 批量修改功能
- **批量选择**：支持多选幻灯片页面进行批量操作
- **批量重试**：对生成失败或不满意的页面进行批量重新生成
- **统一风格**：批量应用相同的修改指令，保持 PPT 风格一致性

---

## 👨‍💻 适用场景

| 用户类型 | 使用场景 |
| --- | --- |
| **小白用户** | 零门槛快速生成美观PPT，无需设计经验 |
| **PPT专业人士** | 参考AI生成的布局，快速获取设计灵感 |
| **教育工作者** | 将教学内容快速转换为配图教案PPT |
| **学生** | 快速完成作业Pre，专注于内容而非排版 |
| **职场人士** | 商业提案、产品介绍快速可视化 |

---

## 🎯 核心功能

### 1. 灵活多样的创作路径
支持**想法**、**大纲**、**页面描述**三种起步方式：
- **一句话生成**：输入一个主题，AI 自动生成结构清晰的大纲和逐页内容描述
- **自然语言编辑**：支持口头修改大纲或描述，AI 实时响应调整
- **大纲/描述模式**：既可一键批量生成，也可手动调整细节

### 2. 强大的素材解析能力
- **多格式支持**：上传 PDF/Docx/MD/Txt 等文件，后台自动解析内容
- **智能提取**：自动识别文本中的关键点、图片链接和图表信息
- **风格参考**：支持上传参考图片或模板，定制 PPT 风格

### 3. "Vibe" 式自然语言修改
- **局部重绘**：对不满意的区域进行口头式修改
- **整页优化**：生成高清、风格统一的页面

### 4. 开箱即用的格式导出
- **多格式支持**：一键导出标准 PPTX 或 PDF 文件
- **完美适配**：默认 16:9 比例，排版无需二次调整

---

## 📦 快速开始

### 使用 Docker Compose🐳（推荐）

```bash
# 1. 克隆代码仓库
git clone https://github.com/YUKEE-spec/AIPPT.git
cd AIPPT

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件配置 API 密钥（可选，也可在前端配置）

# 3. 启动服务
docker compose up -d

# 4. 访问应用
# 前端：http://localhost:3000
# 后端：http://localhost:5000
```

### 从源码部署

#### 环境要求
- Python 3.10+
- Node.js 16+ 和 npm
- [uv](https://github.com/astral-sh/uv) - Python 包管理器

#### 后端启动
```bash
# 安装依赖
uv sync

# 启动服务
cd backend
uv run python app.py
```

#### 前端启动
```bash
cd frontend
npm install
npm run dev
```

---

## 🛠️ 技术架构

| 层级 | 技术栈 |
| --- | --- |
| **前端** | React 18 + TypeScript + Vite 5 + Tailwind CSS + Zustand |
| **后端** | Python 3.10+ + Flask 3.0 + SQLite |
| **AI能力** | 多API支持（Gemini/OpenAI/通义千问/百度文心等） |

---

## 📄 许可证

MIT - 基于 [Banana Slides](https://github.com/Anionex/banana-slides) 开源项目

## 🙏 致谢

感谢 [Anionex/banana-slides](https://github.com/Anionex/banana-slides) 项目提供的优秀基础框架。
