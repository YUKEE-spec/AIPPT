<div align="center">

<img width="256" src="https://github.com/user-attachments/assets/6f9e4cf9-912d-4faa-9d37-54fb676f547e">

# 🍌 PPTer Custom Edition · AI PPT

*AI PPT generation tool built for daily presentation needs*

**[中文](README.md) | English**

<p>

[![Version](https://img.shields.io/badge/version-v0.2.0--custom-FF6B6B.svg)](https://github.com/YUKEE-spec/AIPPT)
![Docker](https://img.shields.io/badge/Docker-Build-2496ED?logo=docker&logoColor=white)
[![License](https://img.shields.io/github/license/Anionex/banana-slides?color=FFD54F)](https://github.com/Anionex/banana-slides/blob/main/LICENSE)

</p> 

<b>Based on <a href="https://github.com/Anionex/banana-slides">Banana Slides</a>, deeply customized for PPTer's daily presentation needs</b>

</div>

---

## 💡 Why This Custom Edition?

As a PPTer who frequently needs to make presentations, have you encountered these pain points?

| 😫 Pain Point | ✅ Custom Edition Solution |
| --- | --- |
| **API configuration is troublesome** - Original only supports single API, changing providers requires code changes | **Multi-API one-click switch** - Supports 10+ mainstream AI services, configure directly in frontend |
| **Difficult to describe requirements** - Don't know how to write prompts for good PPT | **Structured form input** - Fill in topic, audience, style, auto-generate professional prompts |
| **Inefficient batch modifications** - 5 out of 10 pages unsatisfactory, need to regenerate one by one | **Batch select and retry** - Check unsatisfactory pages, one-click batch regeneration |
| **Inconsistent style** - Each page generated separately, overall style fragmented | **Unified style commands** - Apply same modifications in batch, maintain consistency |

---

## 🚀 Three Key Features

### ⚙️ 1. Multi-API Configuration - No More Code Changes

> 💬 *"Company uses Qwen, home uses DeepSeek, travel uses Google..."*

- **10+ AI providers**: Google Gemini, OpenAI, Qwen, Baidu Wenxin, DeepSeek, Zhipu AI, Moonshot...
- **Quick setup wizard**: Complete configuration in 3 minutes on first use, no technical knowledge required
- **One-click switch**: Switch APIs anytime for different scenarios, configurations auto-saved
- **Import/Export**: Share config files with team, new members get started instantly

### 📝 2. Structured Requirements Input - No More Struggling with Prompts

> 💬 *"I just want to make a weekly report PPT, but don't know how to describe it for AI..."*

- **Form-based input**:
  - 📌 PPT Topic: Weekly Work Report
  - 👥 Target Audience: Department Manager
  - 🎨 Style Preference: Clean Business
  - 📄 Page Count: 8-10 pages
- **Smart prompt generation**: Auto-assemble professional prompts from form
- **Scenario templates**: Work reports, project summaries, product introductions, training materials... one-click apply

### 🔄 3. Batch Modification - Double Your Efficiency

> 💬 *"Generated 15 pages, 6 have poor images, do I have to redo them one by one?"*

- **Multi-select mode**: Ctrl+click or box-select multiple pages
- **Batch retry**: One-click regenerate selected pages
- **Unified modification**: Apply same modification command to selected pages
- **Maintain style**: Batch operations automatically inherit overall style settings

---

## 🎯 Typical Use Cases

### 📊 Weekly/Monthly Reports
```
Topic: Week 2 December Work Report
Audience: Department Manager
Style: Clean Business
Content: Tasks completed, next week's plan, issues and suggestions
```
→ Generate 10-page professional weekly report PPT in 5 minutes

### 🚀 Project Reports
```
Topic: XX Project Phase Results Report
Audience: Company Executives
Style: Formal Professional
Content: Project background, progress, results, next steps
```
→ Quickly produce presentation-ready project PPT

### 📚 Training Materials
```
Topic: New Employee Onboarding - Company Policies
Audience: New Employees
Style: Lively Friendly
Content: Company culture, rules, benefits
```
→ Generate illustrated training courseware

---

## 📦 Quick Start

### Docker One-Click Deploy (Recommended)

```bash
git clone https://github.com/YUKEE-spec/AIPPT.git
cd AIPPT
cp .env.example .env
docker compose up -d
```

Visit http://localhost:3000 to start using

### First Time Use
1. Click the **"Click to configure API"** status tag on homepage
2. Follow the wizard to select AI provider and enter API key
3. Select **Structured Input** mode, fill in PPT requirements
4. Click generate, wait for AI to complete creation
5. Batch select and retry unsatisfactory pages

---

## 🛠️ Technical Architecture

| Layer | Tech Stack |
| --- | --- |
| **Frontend** | React 18 + TypeScript + Vite 5 + Tailwind CSS + Zustand |
| **Backend** | Python 3.10+ + Flask 3.0 + SQLite |
| **AI Capabilities** | Multi-API support (Gemini/OpenAI/Qwen/Baidu Wenxin/DeepSeek, etc.) |

---

## 📄 License

MIT - Based on [Banana Slides](https://github.com/Anionex/banana-slides) open source project

## 🙏 Acknowledgments

Thanks to [Anionex/banana-slides](https://github.com/Anionex/banana-slides) project for providing an excellent foundation framework.
