const path = require('path');
const yaml = require('js-yaml');
const { fileUtils } = require('../utils/file-utils');
const { logger } = require('../utils/logger');

/**
 * 統一ルールデータ構造
 */
class UnifiedRule {
  constructor(name, source, content, metadata = {}, type = 'markdown') {
    this.metadata = {
      name,
      source,
      description: metadata.description || '',
      type: metadata.type || 'manual',  // always | auto | manual | agent_requested
      globs: metadata.globs || []
    };
    this.content = {
      raw: content,
      type
    };
  }
}

/**
 * ルールファイルパーサー
 */
class RuleParser {
  constructor(config) {
    this.config = config;
  }

  /**
   * .arb/rules/ ディレクトリからルールファイルを解析
   */
  async parseRulesDirectory() {
    const rulesDir = '.arb/rules';
    const markdownFiles = await fileUtils.getMarkdownFiles(rulesDir);
    
    if (markdownFiles.length === 0) {
      logger.warn('No rule files found in .arb/rules/');
      return [];
    }

    const unifiedRules = [];
    
    for (const filePath of markdownFiles) {
      try {
        const rawContent = await fileUtils.readMarkdown(filePath);
        if (rawContent) {
          const { metadata, content } = this.parseFrontMatter(rawContent);
          const name = path.basename(filePath, '.md');
          const rule = new UnifiedRule(name, filePath, content, metadata);
          unifiedRules.push(rule);
          logger.debug(`Parsed rule file: ${filePath} with metadata:`, metadata);
        }
      } catch (error) {
        logger.error(`Failed to parse rule file ${filePath}:`, error.message);
      }
    }

    logger.info(`Parsed ${unifiedRules.length} rule files`);
    return unifiedRules;
  }

  /**
   * YAMLフロントマターを解析
   */
  parseFrontMatter(content) {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);
    
    if (!match) {
      // フロントマターがない場合
      return {
        metadata: {},
        content: content
      };
    }

    try {
      const yamlContent = match[1];
      const markdownContent = match[2];
      const metadata = yaml.load(yamlContent) || {};
      
      return {
        metadata,
        content: markdownContent
      };
    } catch (error) {
      logger.warn(`Failed to parse YAML front matter: ${error.message}`);
      return {
        metadata: {},
        content: content
      };
    }
  }

  /**
   * ルールファイルをマージ
   */
  mergeRules(unifiedRules) {
    if (unifiedRules.length === 0) {
      return null;
    }

    if (unifiedRules.length === 1) {
      return unifiedRules[0];
    }

    const mergeStrategy = this.config.rules?.merge_strategy || 'append';
    
    switch (mergeStrategy) {
      case 'append':
        return this.appendRules(unifiedRules);
      default:
        logger.warn(`Unknown merge strategy: ${mergeStrategy}, using append`);
        return this.appendRules(unifiedRules);
    }
  }

  /**
   * ルールファイルを結合（append方式）
   */
  appendRules(unifiedRules) {
    const mergedContent = unifiedRules
      .map(rule => rule.content.raw)
      .join('\n\n---\n\n');

    const sources = unifiedRules.map(rule => rule.metadata.source);
    
    return new UnifiedRule(
      'merged-rules',
      sources.join(', '),
      mergedContent
    );
  }

  /**
   * 文字数制限をチェック
   */
  checkLimits(content, limits) {
    const charCount = fileUtils.countChars(content);
    const issues = [];

    if (limits.max_file_chars && charCount > limits.max_file_chars) {
      issues.push(`Content exceeds max file chars: ${charCount} > ${limits.max_file_chars}`);
    }

    if (limits.max_total_chars && charCount > limits.max_total_chars) {
      issues.push(`Content exceeds max total chars: ${charCount} > ${limits.max_total_chars}`);
    }

    return {
      charCount,
      issues,
      valid: issues.length === 0
    };
  }

  /**
   * 設定ファイルを読み込み
   */
  async loadConfig() {
    const configPath = 'arb.config.yaml';
    const config = await fileUtils.readYaml(configPath);
    
    if (!config) {
      throw new Error('Configuration file not found. Run "arb init" first.');
    }

    return config;
  }
}

module.exports = { RuleParser, UnifiedRule }; 