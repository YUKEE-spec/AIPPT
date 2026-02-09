<div align="center">

<img width="256" src="https://github.com/user-attachments/assets/6f9e4cf9-912d-4faa-9d37-54fb676f547e">

# 🍌 PPTer定制版 · AI PPT / PPTer Custom Edition

*专为日常汇报场景打造的 AI PPT 生成工具*
<br>
*AI PPT generation tool built for daily presentation needs*

<p>

[![Version](https://img.shields.io/badge/version-v0.2.0--custom-FF6B6B.svg)](https://github.com/YUKEE-spec/AIPPT)
![Docker](https://img.shields.io/badge/Docker-Build-2496ED?logo=docker&logoColor=white)
[![License](https://img.shields.io/github/license/Anionex/banana-slides?color=FFD54F)](https://github.com/Anionex/banana-slides/blob/main/LICENSE)

</p> 

<b>基于 <a href="https://github.com/Anionex/banana-slides">Banana Slides</a> 开源项目，针对 PPTer 日常汇报需求深度定制</b>
<br>
<b>Based on <a href="https://github.com/Anionex/banana-slides">Banana Slides</a>, deeply customized for PPTer's daily presentation needs</b>

</div>

---

## 💡 为什么需要这个定制版？/ Why This Custom Edition?

作为一个经常需要做汇报的 PPTer，你是否遇到过这些痛点：
<br>
As a PPTer who frequently needs to make presentations, have you encountered these pain points?

| 😫 痛点 / Pain Point | ✅ 定制版解决方案 / Custom Edition Solution |
| --- | --- |
| **API配置门槛高** <br> High API configuration barrier | **零代码配置 + 国产大模型** <br> Zero-code config + Chinese LLMs (Qwen, DeepSeek, etc.) |
| **需求描述困难** <br> Difficult to describe requirements | **结构化表单输入** <br> Structured form input |
| **批量修改低效** <br> Inefficient batch modifications | **批量选择重试** <br> Batch select and retry |
| **风格不统一** <br> Inconsistent style | **统一风格指令** <br> Unified style commands |
| **页数受限** <br> Page limit | **页数随心所欲** <br> Unlimited pages |
| **成本不透明** <br> Opaque costs | **Token实时监控** <br> Real-time token monitoring |

---

## 🚀 定制版五大特性 / Five Key Features

### ⚙️ 1. 多API配置管理 - 告别改代码
### Multi-API Configuration - No More Code Changes

> 💬 *"有钱任性用🍌，省钱稳重用国产"*
> <br>
> *"Company uses Qwen, home uses DeepSeek, travel uses Google..."*

- **10+ AI服务商 / 10+ AI providers**：Google Gemini, OpenAI, Qwen, Baidu Wenxin, DeepSeek, Zhipu AI, Moonshot...
- **快速配置向导 / Quick setup wizard**：首次使用3分钟完成配置，无需懂技术 / Complete configuration in 3 minutes on first use, no technical knowledge required
- **一键切换 / One-click switch**：不同场景随时切换API，配置自动保存 / Switch APIs anytime for different scenarios, configurations auto-saved
- **导入导出 / Import/Export**：团队共享配置文件，新人秒上手 / Share config files with team, new members get started instantly

### 📝 2. 结构化需求输入 - 不用绞尽脑汁写prompt
### Structured Requirements Input - No More Struggling with Prompts

> 💬 *"我就想做个周报PPT，但不知道怎么描述才能让AI理解..."*
> <br>
> *"I just want to make a weekly report PPT, but don't know how to describe it for AI..."*

- **表单化输入 / Form-based input**：
  - 📌 PPT主题 / PPT Topic：周工作汇报 / Weekly Work Report
  - 👥 目标受众 / Target Audience：部门领导 / Department Manager
  - 🎨 风格偏好 / Style Preference：简洁商务 / Clean Business
  - 📄 页数要求 / Page Count：8-10页 / 8-10 pages
- **智能prompt生成 / Smart prompt generation**：根据表单自动组装专业提示词 / Auto-assemble professional prompts from form
- **场景模板 / Scenario templates**：工作汇报、项目总结、产品介绍、培训课件...一键套用 / Work reports, project summaries, product introductions, training materials... one-click apply

### 🔄 3. 批量修改功能 - 效率翻倍
### Batch Modification - Double Your Efficiency

> 💬 *"生成了15页，有6页配图不太行，难道要一页页重做？"*
> <br>
> *"Generated 15 pages, 6 have poor images, do I have to redo them one by one?"*

- **多选模式 / Multi-select mode**：Ctrl+点击 或 框选多个页面 / Ctrl+click or box-select multiple pages
- **批量重试 / Batch retry**：选中的页面一键重新生成 / One-click regenerate selected pages
- **统一修改 / Unified modification**：对选中页面应用相同的修改指令 / Apply same modification command to selected pages
- **保持风格 / Maintain style**：批量操作自动继承整体风格设定 / Batch operations automatically inherit overall style settings

### 📄 4. 页数不受限 - 突破工具限制
### Unlimited Pages - Break Tool Limitations

> 💬 *"NotebookLM只能生成15页，我的年度总结需要30页怎么办？"*
> <br>
> *"NotebookLM can only generate 15 pages, but my annual summary needs 30 pages?"*

- **无页数上限 / No page limit**：想生成多少页就多少页 / Generate as many pages as you want
- **灵活控制 / Flexible control**：在结构化输入中指定页数需求 / Specify page count in structured input
- **长文档支持 / Long document support**：适合年度总结、详细方案等长篇PPT / Suitable for annual summaries, detailed proposals, etc.

### 📊 5. Token消耗监控 - 成本透明可控
### Token Consumption Monitoring - Transparent Cost Control

> 💬 *"用了一天不知道花了多少钱，月底账单吓一跳..."*
> <br>
> *"Used it all day without knowing how much it cost, shocked by the bill at month end..."*

- **实时统计 / Real-time stats**：首页显示累计Token消耗 / Homepage displays cumulative token consumption
- **分类统计 / Categorized stats**：文本生成和图像生成分开计算 / Text generation and image generation calculated separately
- **成本预估 / Cost estimation**：根据Token用量估算API费用 / Estimate API costs based on token usage

---

## 🎯 典型使用场景 / Typical Use Cases

### 📊 周报/月报汇报 / Weekly/Monthly Reports
```
主题 / Topic：12月第2周工作汇报 / Week 2 December Work Report
受众 / Audience：部门经理 / Department Manager
风格 / Style：简洁商务 / Clean Business
内容 / Content：本周完成任务、下周计划、问题与建议 / Tasks completed, next week's plan, issues and suggestions
```
→ 5分钟生成10页专业周报PPT / Generate 10-page professional weekly report PPT in 5 minutes

### 🚀 项目汇报 / Project Reports
```
主题 / Topic：XX项目阶段性成果汇报 / XX Project Phase Results Report
受众 / Audience：公司高管 / Company Executives
风格 / Style：正式专业 / Formal Professional
内容 / Content：项目背景、进展、成果、下一步计划 / Project background, progress, results, next steps
```
→ 快速产出可直接汇报的项目PPT / Quickly produce presentation-ready project PPT

### 📚 培训分享 / Training Materials
```
主题 / Topic：新员工入职培训-公司制度介绍 / New Employee Onboarding - Company Policies
受众 / Audience：新入职员工 / New Employees
风格 / Style：活泼友好 / Lively Friendly
内容 / Content：公司文化、规章制度、福利待遇 / Company culture, rules, benefits
```
→ 生成图文并茂的培训课件 / Generate illustrated training courseware

---

## 📦 快速开始 / Quick Start

### Docker 一键部署（推荐）/ Docker One-Click Deploy (Recommended)

```bash
git clone https://github.com/YUKEE-spec/AIPPT.git
cd AIPPT
cp .env.example .env
docker compose up -d
```

访问 http://localhost:3000 开始使用
<br>
Visit http://localhost:3000 to start using

### ☁️ 部署到 Zeabur / Deploy to Zeabur

无需服务器，一键部署到 Zeabur 平台。
<br>
Deploy to Zeabur platform with one click, no server required.

👉 **[查看详细部署指南 / View Detailed Deployment Guide](ZEABUR_DEPLOY.md)**

1. 将代码推送到 GitHub / Push code to GitHub
2. 在 Zeabur 创建项目 / Create project on Zeabur
3. 分别部署后端(backend)和前端(frontend)服务 / Deploy backend and frontend services separately
4. 配置环境变量连接前后端 / Configure environment variables to connect frontend and backend

### 首次使用 / First Time Use
1. 点击首页的 **"点击配置API"** 状态标签 / Click the **"Click to configure API"** status tag on homepage
2. 跟随向导选择AI服务商并填入API密钥 / Follow the wizard to select AI provider and enter API key
3. 选择 **结构化输入** 模式，填写PPT需求 / Select **Structured Input** mode, fill in PPT requirements
4. 点击生成，等待AI完成创作 / Click generate, wait for AI to complete creation
5. 对不满意的页面批量选择重试 / Batch select and retry unsatisfactory pages

---

## 🛠️ 技术架构 / Technical Architecture

| 层级 / Layer | 技术栈 / Tech Stack |
| --- | --- |
| **前端 / Frontend** | React 18 + TypeScript + Vite 5 + Tailwind CSS + Zustand |
| **后端 / Backend** | Python 3.10+ + Flask 3.0 + SQLite |
| **AI能力 / AI Capabilities** | 多API支持（Gemini/OpenAI/通义千问/百度文心/DeepSeek等）<br> Multi-API support (Gemini/OpenAI/Qwen/Baidu Wenxin/DeepSeek, etc.) |

---

## 📄 许可证 / License

MIT - 基于 [Banana Slides](https://github.com/Anionex/banana-slides) 开源项目
<br>
MIT - Based on [Banana Slides](https://github.com/Anionex/banana-slides) open source project

## 🙏 致谢 / Acknowledgments

感谢 [Anionex/banana-slides](https://github.com/Anionex/banana-slides) 项目提供的优秀基础框架。
<br>
Thanks to [Anionex/banana-slides](https://github.com/Anionex/banana-slides) project for providing an excellent foundation framework.
