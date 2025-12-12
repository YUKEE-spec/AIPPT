<div align="center">

<img width="256" src="https://github.com/user-attachments/assets/6f9e4cf9-912d-4faa-9d37-54fb676f547e">

# 🍌 PPTer定制版 · AI PPT

*专为日常汇报场景打造的 AI PPT 生成工具*

**中文 | [English](README_EN.md)**

<p>

[![Version](https://img.shields.io/badge/version-v0.2.0--custom-FF6B6B.svg)](https://github.com/YUKEE-spec/AIPPT)
![Docker](https://img.shields.io/badge/Docker-Build-2496ED?logo=docker&logoColor=white)
[![License](https://img.shields.io/github/license/Anionex/banana-slides?color=FFD54F)](https://github.com/Anionex/banana-slides/blob/main/LICENSE)

</p> 

<b>基于 <a href="https://github.com/Anionex/banana-slides">Banana Slides</a> 开源项目，针对 PPTer 日常汇报需求深度定制</b>

</div>

---

## 💡 为什么需要这个定制版？

作为一个经常需要做汇报的 PPTer，你是否遇到过这些痛点：

| 😫 痛点 | ✅ 定制版解决方案 |
| --- | --- |
| **API配置门槛高** - 原版需要改代码配置，且仅支持GoogleAPI | **零代码配置 + 国产大模型** - 前端向导式配置，支持通义千问、百度文心、DeepSeek等国产大模型，无需科学上网 |
| **需求描述困难** - 不知道怎么写prompt才能生成好的PPT | **结构化表单输入** - 填写主题、受众、风格，自动生成专业prompt |
| **批量修改低效** - 10页PPT有5页不满意，要一页页重新生成 | **批量选择重试** - 勾选不满意的页面，一键批量重新生成 |
| **风格不统一** - 每页单独生成，整体风格割裂 | **统一风格指令** - 批量应用相同修改，保持一致性 |
| **页数受限** - NotebookLM等工具限制15-20页 | **页数随心所欲** - 想生成多少页就多少页，不受限制 |
| **成本不透明** - 不知道用了多少Token，费用难以控制 | **Token实时监控** - 首页显示Token消耗统计，成本一目了然 |

---

## 🚀 定制版五大特性

### ⚙️ 1. 多API配置管理 - 告别改代码

> 💬 *"有钱任性用🍌，省钱稳重用国产"*

- **10+ AI服务商**：Google Gemini、OpenAI、通义千问、百度文心、DeepSeek、智谱AI、月之暗面...
- **快速配置向导**：首次使用3分钟完成配置，无需懂技术
- **一键切换**：不同场景随时切换API，配置自动保存
- **导入导出**：团队共享配置文件，新人秒上手

### � 2. 结场构化需求输入 - 不用绞尽脑汁写prompt

> 💬 *"我就想做个周报PPT，但不知道怎么描述才能让AI理解..."*

- **表单化输入**：
  - 📌 PPT主题：周工作汇报
  - 👥 目标受众：部门领导
  - 🎨 风格偏好：简洁商务
  - 📄 页数要求：8-10页
- **智能prompt生成**：根据表单自动组装专业提示词
- **场景模板**：工作汇报、项目总结、产品介绍、培训课件...一键套用

### 🔄 3. 批量修改功能 - 效率翻倍

> 💬 *"生成了15页，有6页配图不太行，难道要一页页重做？"*

- **多选模式**：Ctrl+点击 或 框选多个页面
- **批量重试**：选中的页面一键重新生成
- **统一修改**：对选中页面应用相同的修改指令
- **保持风格**：批量操作自动继承整体风格设定

### 📄 4. 页数不受限 - 突破工具限制

> 💬 *"NotebookLM只能生成15页，我的年度总结需要30页怎么办？"*

- **无页数上限**：想生成多少页就多少页
- **灵活控制**：在结构化输入中指定页数需求
- **长文档支持**：适合年度总结、详细方案等长篇PPT

### 📊 5. Token消耗监控 - 成本透明可控

> 💬 *"用了一天不知道花了多少钱，月底账单吓一跳..."*

- **实时统计**：首页显示累计Token消耗
- **分类统计**：文本生成和图像生成分开计算
- **成本预估**：根据Token用量估算API费用

---

## 🎯 典型使用场景

### 📊 周报/月报汇报
```
主题：12月第2周工作汇报
受众：部门经理
风格：简洁商务
内容：本周完成任务、下周计划、问题与建议
```
→ 5分钟生成10页专业周报PPT

### 🚀 项目汇报
```
主题：XX项目阶段性成果汇报
受众：公司高管
风格：正式专业
内容：项目背景、进展、成果、下一步计划
```
→ 快速产出可直接汇报的项目PPT

### 📚 培训分享
```
主题：新员工入职培训-公司制度介绍
受众：新入职员工
风格：活泼友好
内容：公司文化、规章制度、福利待遇
```
→ 生成图文并茂的培训课件

---

## 📦 快速开始

### Docker 一键部署（推荐）

```bash
git clone https://github.com/YUKEE-spec/AIPPT.git
cd AIPPT
cp .env.example .env
docker compose up -d
```

访问 http://localhost:3000 开始使用

### 首次使用
1. 点击首页的 **"点击配置API"** 状态标签
2. 跟随向导选择AI服务商并填入API密钥
3. 选择 **结构化输入** 模式，填写PPT需求
4. 点击生成，等待AI完成创作
5. 对不满意的页面批量选择重试

---

## 🛠️ 技术架构

| 层级 | 技术栈 |
| --- | --- |
| **前端** | React 18 + TypeScript + Vite 5 + Tailwind CSS + Zustand |
| **后端** | Python 3.10+ + Flask 3.0 + SQLite |
| **AI能力** | 多API支持（Gemini/OpenAI/通义千问/百度文心/DeepSeek等） |

---

## 📄 许可证

MIT - 基于 [Banana Slides](https://github.com/Anionex/banana-slides) 开源项目

## 🙏 致谢

感谢 [Anionex/banana-slides](https://github.com/Anionex/banana-slides) 项目提供的优秀基础框架。
