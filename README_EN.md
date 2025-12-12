<div align="center">

<img width="256" src="https://github.com/user-attachments/assets/6f9e4cf9-912d-4faa-9d37-54fb676f547e">

# 🍌 TYQ Custom Edition · AI PPT

*Vibe your PPT like vibing code.*

**[中文](README.md) | English**

<p>

[![Version](https://img.shields.io/badge/version-v0.2.0--custom-FF6B6B.svg)](https://github.com/YUKEE-spec/AIPPT)
![Docker](https://img.shields.io/badge/Docker-Build-2496ED?logo=docker&logoColor=white)
[![License](https://img.shields.io/github/license/Anionex/banana-slides?color=FFD54F)](https://github.com/Anionex/banana-slides/blob/main/LICENSE)

</p> 

<b>A customized enhanced version based on <a href="https://github.com/Anionex/banana-slides">Banana Slides</a> open source project</b>

<b>🎯 Lower the barrier to PPT creation, enabling everyone to quickly create beautiful and professional presentations</b>

</div>

---

## 🚀 Custom Edition Features

This version adds the following features on top of the original Banana Slides:

### ⚙️ 1. Multi-API Configuration Management
- **Multi-provider support**: Supports Google Gemini, OpenAI, Qwen, Baidu Wenxin, DeepSeek and other AI services
- **Quick setup wizard**: Step-by-step guidance for first-time users to easily complete API configuration
- **Flexible switching**: Switch between different API providers at any time, supports custom OpenAI-compatible interfaces
- **Import/Export config**: Support configuration file import and export for easy backup and migration

### 📝 2. Structured PPT Requirements Input
- **Form-based input**: Input PPT topic, audience, style and other information through structured forms
- **Smart prompts**: Automatically generate optimized AI prompts based on input content
- **Requirement templates**: Preset templates for common scenarios to quickly start creating

### 🔄 3. Batch Modification
- **Batch selection**: Support multi-select slide pages for batch operations
- **Batch retry**: Batch regenerate pages that failed or are unsatisfactory
- **Unified style**: Apply the same modification instructions in batch to maintain PPT style consistency

---

## 👨‍💻 Use Cases

| User Type | Use Case |
| --- | --- |
| **Beginners** | Zero-threshold rapid generation of beautiful PPTs, no design experience required |
| **PPT Professionals** | Reference AI-generated layouts to quickly gain design inspiration |
| **Educators** | Quickly convert teaching content into illustrated lesson PPTs |
| **Students** | Quickly complete assignment presentations, focusing on content rather than layout |
| **Professionals** | Business proposals, product introductions quickly visualized |

---

## 🎯 Core Features

### 1. Flexible and Diverse Creation Paths
Supports three starting methods: **idea**, **outline**, and **page description**:
- **One-sentence generation**: Enter a topic, AI automatically generates a clear outline and page-by-page content description
- **Natural language editing**: Supports verbal modification of outline or description, AI responds and adjusts in real-time
- **Outline/Description mode**: Can be batch-generated with one click or manually adjusted for details

### 2. Powerful Material Parsing Capabilities
- **Multi-format support**: Upload PDF/Docx/MD/Txt and other files, backend automatically parses content
- **Smart extraction**: Automatically identifies key points, image links, and chart information in text
- **Style reference**: Supports uploading reference images or templates to customize PPT style

### 3. "Vibe" Style Natural Language Modification
- **Local redraw**: Make verbal modifications to unsatisfactory areas
- **Full page optimization**: Generate high-definition, style-consistent pages

### 4. Out-of-the-box Format Export
- **Multi-format support**: One-click export to standard PPTX or PDF files
- **Perfect adaptation**: Default 16:9 ratio, layout requires no secondary adjustment

---

## 📦 Quick Start

### Using Docker Compose🐳 (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/YUKEE-spec/AIPPT.git
cd AIPPT

# 2. Configure environment variables
cp .env.example .env
# Edit .env file to configure API keys (optional, can also be configured in frontend)

# 3. Start services
docker compose up -d

# 4. Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Deploy from Source

#### Environment Requirements
- Python 3.10+
- Node.js 16+ and npm
- [uv](https://github.com/astral-sh/uv) - Python package manager

#### Start Backend
```bash
# Install dependencies
uv sync

# Start service
cd backend
uv run python app.py
```

#### Start Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🛠️ Technical Architecture

| Layer | Tech Stack |
| --- | --- |
| **Frontend** | React 18 + TypeScript + Vite 5 + Tailwind CSS + Zustand |
| **Backend** | Python 3.10+ + Flask 3.0 + SQLite |
| **AI Capabilities** | Multi-API support (Gemini/OpenAI/Qwen/Baidu Wenxin, etc.) |

---

## 📄 License

MIT - Based on [Banana Slides](https://github.com/Anionex/banana-slides) open source project

## 🙏 Acknowledgments

Thanks to [Anionex/banana-slides](https://github.com/Anionex/banana-slides) project for providing an excellent foundation framework.
