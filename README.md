# AI Rule Bridge

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

Rule Management CLI for AI Development Tools (MVP) - Automatically generate project rules in the specific format for each AI tool.

## Overview

AI Rule Bridge (ARB) is a simple Node.js CLI tool that centralizes the management of project rules for multiple AI development tools (such as GitHub Copilot, Cursor, Claude, Windsurf, Cline, OpenAI Codex, and Gemini CLI) and automatically generates them in each tool's specific format.

### Main Features

- 📝 **Unified Rule Management**: Manage rules for all AI tools in the `.arb/rules/` directory.
- 🔄 **Automatic Generation**: Automatically generate tool-specific files from unified rules.
- 🛠️ **Multi-tool Support**: Supports 7 major AI development tools.
- 📏 **Character Limit Handling**: Automatically handles tool-specific character limits.
- 💾 **Backup Functionality**: Optional backup of existing files.

### Supported AI Tools

| Tool | Output Location | Format | Limitations |
|--------|----------|------|----------|
| GitHub Copilot | `.github/copilot-instructions.md` | Markdown | Project-specific |
| Windsurf Cascade | `.windsurf/rules/` | Markdown | ~6000 chars/file, 12000 chars total |
| Cursor | `.cursor/rules/` | MDC | Front-matter + Markdown |
| Claude Code | `CLAUDE.md` | Markdown | Simple format |
| Cline | `.clinerules` | Markdown | Single file |
| OpenAI Codex | `AGENTS.md` | Markdown | Simple format |
| Gemini CLI | `GEMINI.md` | Markdown | Simple format |

## Installation

```bash
npm install -g ai-rule-bridge
```

## Quick Start

1. **Initialize Project**:
   ```bash
   arb init [project-name]
   ```

2. **Edit Rules**: Add project rules to `.arb/rules/*.md` files.

3. **Generate AI Tool Files**:
   ```bash
   arb generate
   ```

4. **Check Status**:
   ```bash
   arb status
   ```


## Directory Structure

```
your-project/
├── .arb/
│   ├── config.yaml          # Configuration file
│   └── rules/               # Rule file directory
│       ├── project-rules.md # Sample rule file
│       └── *.md            # Custom rule files
├── .github/
│   └── copilot-instructions.md  # Generated file for Copilot
├── .windsurf/
│   └── rules/               # Generated files for Windsurf
├── .cursor/
│   └── rules/               # Generated files for Cursor
├── CLAUDE.md                # Generated file for Claude
├── .clinerules             # Generated file for Cline
├── AGENTS.md                # Generated file for OpenAI Codex
└── GEMINI.md                # Generated file for Gemini CLI
```

## Rule Files

Rule files in the `.arb/rules/` directory are in Markdown format:

```markdown
# Project Rules

## Coding Conventions
- Use camelCase for function names.
- Use meaningful names for variables.
- Write comments in English.

## File Structure
- Place source code in the src/ directory.
- Place test files in the tests/ directory.

## AI Development Guidelines
- Emphasize code readability.
- Implement appropriate error handling.
- Write tests to maintain quality.
```

## Usage Examples

### Basic Usage

```bash
# Initialize project
arb init my-ai-project

# Edit rules (add project-specific rules)
# Edit .arb/rules/project-rules.md

# Generate all tool files
arb generate

# Check status
arb status
```

### Custom Configuration

You can customize settings by editing `.arb/config.yaml`:

```yaml
# Disable a specific tool
targets:
  copilot:
    enabled: false  # Disable Copilot generation
```

## Requirements

- Node.js 18+ (LTS recommended)
- npm or yarn

## Development

```bash
# Clone repository
git clone https://github.com/maigo999/AI-Rule-Bridge.git
cd AI-Rule-Bridge

# Install dependencies
npm install

# Run tests
npm test

# Run lint
npm run lint
```
## License

MIT License

## Roadmap

- [ ] Watch mode (file change monitoring)
- [ ] Web UI version
- [ ] CI/CD integration
- [ ] Custom template support
- [ ] Support for additional AI tools

---

**AI Rule Bridge** - Easily manage rules across AI tools 🤖✨
