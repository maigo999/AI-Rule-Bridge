# AI 规则桥梁

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

面向 AI 开发工具的规则管理 CLI (MVP) - 以各种 AI 工具特有的格式自动生成项目规则。

## 概述

AI 规则桥梁 (ARB) 是一个简单的 Node.js CLI 工具，用于集中管理多个 AI 开发工具（如 GitHub Copilot、Cursor、Claude、Windsurf、Cline、OpenAI Codex 和 Gemini CLI）的项目规则，并以各种工具特有的格式自动生成它们。

### 主要功能

- 📝 **统一规则管理**: 在 `.arb/rules/` 目录中管理所有 AI 工具的规则。
- 🔄 **自动生成**: 从统一规则自动生成特定于工具的文件。
- 🛠️ **多工具支持**: 支持 7 种主要的 AI 开发工具。
- 📏 **字符限制处理**: 自动处理特定于工具的字符限制。
- 💾 **备份功能**: 可选地备份现有文件。

### 支持的 AI 工具

| 工具 | 输出位置 | 格式 | 限制 |
|--------|----------|------|----------|
| GitHub Copilot | `.github/copilot-instructions.md` | Markdown | 项目特定 |
| Windsurf Cascade | `.windsurf/rules/` | Markdown | ~6000 字符/文件，总计 12000 字符 |
| Cursor | `.cursor/rules/` | MDC | Front-matter + Markdown |
| Claude Code | `CLAUDE.md` | Markdown | 简单格式 |
| Cline | `.clinerules` | Markdown | 单个文件 |
| OpenAI Codex | `AGENTS.md` | Markdown | 简单格式 |
| Gemini CLI | `GEMINI.md` | Markdown | 简单格式 |

## 安装

```bash
npm install -g ai-rule-bridge
```

## 快速入门

1. **初始化项目**:
   ```bash
   arb init [project-name]
   ```

2. **编辑规则**: 将项目规则添加到 `.arb/rules/*.md` 文件中。

3. **生成 AI 工具文件**:
   ```bash
   arb generate
   ```

4. **检查状态**:
   ```bash
   arb status
   ```


## 目录结构

```
your-project/
├── .arb/
│   ├── config.yaml          # 配置文件
│   └── rules/               # 规则文件目录
│       ├── project-rules.md # 示例规则文件
│       └── *.md            # 自定义规则文件
├── .github/
│   └── copilot-instructions.md  # 为 Copilot 生成的文件
├── .windsurf/
│   └── rules/               # 为 Windsurf 生成的文件
├── .cursor/
│   └── rules/               # 为 Cursor 生成的文件
├── CLAUDE.md                # 为 Claude 生成的文件
├── .clinerules             # 为 Cline 生成的文件
├── AGENTS.md                # 为 OpenAI Codex 生成的文件
└── GEMINI.md                # 为 Gemini CLI 生成的文件
```

## 规则文件

`.arb/rules/` 目录中的规则文件采用 Markdown 格式：

```markdown
# 项目规则

## 编码约定
- 函数名使用 camelCase。
- 变量名使用有意义的名称。
- 用中文写注释。

## 文件结构
- 将源代码放在 src/ 目录中。
- 将测试文件放在 tests/ 目录中。

## AI 开发指南
- 强调代码的可读性。
- 实现适当的错误处理。
- 编写测试以保持质量。
```

## 使用示例

### 基本用法

```bash
# 初始化项目
arb init my-ai-project

# 编辑规则 (添加特定于项目的规则)
# 编辑 .arb/rules/project-rules.md

# 生成所有工具文件
arb generate

# 检查状态
arb status
```

### 自定义配置

您可以通过编辑 `.arb/config.yaml` 来自定义设置：

```yaml
# 禁用特定工具
targets:
  copilot:
    enabled: false  # 禁用 Copilot 生成
```

## 要求

- Node.js 18+ (推荐 LTS)
- npm 或 yarn

## 开发

```bash
# 克隆存储库
git clone https://github.com/maigo999/AI-Rule-Bridge.git
cd AI-Rule-Bridge

# 安装依赖项
npm install

# 运行测试
npm test

# 运行 lint
npm run lint
```
## 许可证

MIT 许可证

## 路线图

- [ ] 观察模式 (文件更改监控)
- [ ] Web UI 版本
- [ ] CI/CD 集成
- [ ] 自定义模板支持
- [ ] 支持其他 AI 工具

---

**AI 规则桥梁** - 轻松管理各种 AI 工具的规则 🤖✨
