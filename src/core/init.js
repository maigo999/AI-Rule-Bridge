const path = require('path');
const { fileUtils } = require('../utils/file-utils');
const { logger } = require('../utils/logger');

/**
 * デフォルト設定を取得
 */
function getDefaultConfig(projectName) {
  return {
    version: "1.0",
    project: {
      name: projectName || path.basename(process.cwd())
    },
    targets: {
      copilot: {
        enabled: true,
        output: ".github/copilot-instructions/"
      },
      windsurf: {
        enabled: true,
        output: ".windsurf/rules/"
      },
      cursor: {
        enabled: true,
        output: ".cursor/rules/"
      },
      claude: {
        enabled: true,
        output: "CLAUDE.md"
      },
      cline: {
        enabled: true,
        output: ".clinerules"
      }
    },
    rules: {
      merge_strategy: "append"
    },
    versioning: {
      config_version: "1.0",
      backup_existing: false,
      migration_auto: true
    }
  };
}



/**
 * サンプルルールファイルの内容
 */
function getSampleRuleContent() {
  return `---
# ルールの説明（必須）
description: "プロジェクト全体の開発ガイドライン"

# ルールの適用タイプ（必須）
# always: 常に適用
# auto: globsパターンにマッチするファイルで自動適用
# manual: 手動で呼び出した時のみ適用
# agent_requested: AIが必要と判断した時に適用
type: "always"

# 適用するファイルパターン（配列形式、オプション）
# Cursor、Windsurfで使用、VS Code Copilotはglobs[0]を使用
globs: []
---

# プロジェクトルール

## 概要
このファイルは AIRuleBridge によって管理されるプロジェクトルールです。

## 開発ガイドライン

### コーディング規約
- 関数名は camelCase を使用する
- 変数名は意味のある名前を付ける
- コメントは日本語で記述する

### ファイル構成
- src/ ディレクトリにソースコードを配置
- tests/ ディレクトリにテストファイルを配置

## AI開発支援

### 推奨事項
- コードの可読性を重視する
- 適切なエラーハンドリングを実装する
- テストを書いて品質を保つ

このルールファイルを編集して、プロジェクト固有のルールを追加してください。
`;
}

/**
 * プロジェクトを初期化
 */
async function initProject(projectName) {
  const configPath = 'arb.config.yaml';
  const rulesDir = '.arb/rules';
  const sampleRulePath = path.join(rulesDir, 'project-rules.md');

  // 既存の設定ファイルをチェック
  if (await fileUtils.exists(configPath)) {
    logger.warn('Configuration file already exists. Skipping initialization.');
    return;
  }

  // .arb/config.yaml を作成
  const config = getDefaultConfig(projectName);
  await fileUtils.writeYaml(configPath, config);
  logger.success(`Created configuration file: ${configPath}`);

  // .arb/rules/ ディレクトリを作成
  if (!(await fileUtils.exists(rulesDir))) {
    await fileUtils.writeFile(sampleRulePath, getSampleRuleContent());
    logger.success(`Created rules directory: ${rulesDir}`);
    logger.success(`Created sample rule file: ${sampleRulePath}`);
  } else {
    logger.info(`Rules directory already exists: ${rulesDir}`);
  }

  // 使用方法の案内
  logger.info('\nNext steps:');
  logger.info('1. Edit .arb/rules/*.md files to define your project rules');
  logger.info('2. Run "arb generate" to create AI tool files');
  logger.info('3. Run "arb status" to check configuration');
}

module.exports = { initProject }; 