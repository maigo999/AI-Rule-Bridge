# AI Rule Bridge

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

AI開発ツール向けルール管理CLI（MVP版）- プロジェクトルールを各AIツール固有の形式で自動生成

## 概要

AI Rule Bridge（ARB）は、複数のAI開発ツール（GitHub Copilot、Cursor、Claude、Windsurf、Clineなど）で使用するプロジェクトルールを一元管理し、各ツール固有の形式で自動生成するシンプルなNode.js CLIツールです。

### 主な機能

- 📝 **統一ルール管理**: `.arb/rules/`ディレクトリで全AIツールのルールを管理
- 🔄 **自動生成**: 統一ルールから各ツール固有のファイルを自動生成
- 🛠️ **複数ツール対応**: 5つの主要AI開発ツールをサポート
- 📏 **文字数制限対応**: ツール固有の文字数制限を自動処理
- 💾 **バックアップ機能**: 既存ファイルのオプションバックアップ

### 対応AIツール

| ツール | 出力場所 | 形式 | 制限事項 |
|--------|----------|------|----------|
| GitHub Copilot | `.github/copilot-instructions.md` | Markdown | プロジェクト専用 |
| Windsurf Cascade | `.windsurf/rules/` | Markdown | ~6000文字/ファイル、12000文字合計 |
| Cursor | `.cursor/rules/` | MDC | フロントマター + Markdown |
| Claude Code | `CLAUDE.md` | Markdown | シンプル形式 |
| Cline | `.clinerules` | Markdown | 単一ファイル |

## インストール

```bash
npm install -g ai-rule-bridge
```

## クイックスタート

1. **プロジェクト初期化**:
   ```bash
   arb init [project-name]
   ```

2. **ルール編集**: `.arb/rules/*.md`ファイルにプロジェクトルールを追加

3. **AIツールファイル生成**:
   ```bash
   arb generate
   ```

4. **ステータス確認**:
   ```bash
   arb status
   ```


## ディレクトリ構造

```
your-project/
├── .arb/
│   ├── config.yaml          # 設定ファイル
│   └── rules/               # ルールファイルディレクトリ
│       ├── project-rules.md # サンプルルールファイル
│       └── *.md            # カスタムルールファイル
├── .github/
│   └── copilot-instructions.md  # Copilot用生成ファイル
├── .windsurf/
│   └── rules/               # Windsurf用生成ファイル
├── .cursor/
│   └── rules/               # Cursor用生成ファイル
├── CLAUDE.md                # Claude用生成ファイル
└── .clinerules             # Cline用生成ファイル
```

## ルールファイル

`.arb/rules/`ディレクトリのルールファイルはMarkdown形式です：

```markdown
# プロジェクトルール

## コーディング規約
- 関数名はcamelCaseを使用する
- 変数名は意味のある名前を付ける
- コメントは日本語で記述する

## ファイル構成
- src/ ディレクトリにソースコードを配置
- tests/ ディレクトリにテストファイルを配置

## AI開発ガイドライン
- コードの可読性を重視する
- 適切なエラーハンドリングを実装する
- テストを書いて品質を保つ
```

## 使用例

### 基本的な使用方法

```bash
# プロジェクト初期化
arb init my-ai-project

# ルール編集（プロジェクト固有のルールを追加）
# .arb/rules/project-rules.md を編集

# 全ツールファイル生成
arb generate

# ステータス確認
arb status
```

### カスタム設定

`.arb/config.yaml`を編集して設定をカスタマイズできます：

```yaml
# 特定ツールを無効化
targets:
  copilot:
    enabled: false  # Copilot生成を無効化
```

## 要件

- Node.js 18+ (LTS推奨)
- npm または yarn

## 開発

```bash
# リポジトリクローン
git clone https://github.com/maigo999/AI-Rule-Bridge.git
cd AI-Rule-Bridge

# 依存関係インストール
npm install

# テスト実行
npm test

# リント実行
npm run lint
```
## ライセンス

MIT License

## ロードマップ

- [ ] ウォッチモード（ファイル変更監視）
- [ ] Web UI版
- [ ] CI/CD統合
- [ ] カスタムテンプレートサポート
- [ ] 追加AIツールサポート

---

**AI Rule Bridge** - AIツール間のルール管理を簡単に 🤖✨ 