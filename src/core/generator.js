const { RuleParser } = require('./parser');
const { CopilotConverter } = require('../converters/copilot');
const { WindsurfConverter } = require('../converters/windsurf');
const { CursorConverter } = require('../converters/cursor');
const { ClaudeConverter } = require('../converters/claude');
const { ClineConverter } = require('../converters/cline');
const { OpenAICodexConverter } = require('../converters/openai-codex');
const { GeminiCliConverter } = require('../converters/gemini-cli');
const { logger } = require('../utils/logger');

/**
 * ファイル生成器
 */
class Generator {
  constructor(config) {
    this.config = config;
    this.converters = {
      copilot: new CopilotConverter(config),
      windsurf: new WindsurfConverter(config),
      cursor: new CursorConverter(config),
      claude: new ClaudeConverter(config),
      cline: new ClineConverter(config),
      'openai-codex': new OpenAICodexConverter(config),
      'gemini-cli': new GeminiCliConverter(config)
    };
  }

  /**
   * 全ツール用ファイルを生成
   */
  async generateAll() {
    const results = {};

    // ルールファイルを解析
    const parser = new RuleParser(this.config);
    const unifiedRules = await parser.parseRulesDirectory();
    
    if (unifiedRules.length === 0) {
      throw new Error('No rule files found in .arb/rules/. Run "arb init" first.');
    }

    // 各ツール用に生成
    for (const [toolName, converter] of Object.entries(this.converters)) {
      if (this.config.targets[toolName]?.enabled) {
        try {
          logger.debug(`Generating ${toolName} files...`);
          
          let result;
          if (typeof converter.generateFromRules === 'function' && toolName !== 'copilot' && toolName !== 'windsurf' && toolName !== 'cursor' && toolName !== 'claude' && toolName !== 'cline') {
            const singleFile = converter.generateFromRules(unifiedRules);
            result = await converter.writeFiles(singleFile);
          } else {
            let converted;
            if (this.supportMultipleFiles(toolName)) {
              converted = unifiedRules.map(rule => converter.convert(rule));
            } else {
              const mergedRule = parser.mergeRules(unifiedRules);
              converted = converter.convert(mergedRule);
            }
            result = await converter.writeFiles(converted);
          }
          results[toolName] = result;
          
          if (result.success) {
            logger.debug(`✓ ${toolName}: Generated successfully`);
          } else {
            logger.debug(`✗ ${toolName}: ${result.error}`);
          }
        } catch (error) {
          results[toolName] = { success: false, error: error.message };
          logger.debug(`✗ ${toolName}: ${error.message}`);
        }
      } else {
        results[toolName] = { success: false, error: 'Tool is disabled' };
        logger.debug(`- ${toolName}: Disabled`);
      }
    }

    return results;
  }

  /**
   * ツールが複数ファイルをサポートするかチェック
   */
  supportMultipleFiles(toolName) {
    const multiFileTools = ['copilot', 'windsurf', 'cursor'];  // 複数ファイル対応ツール
    return multiFileTools.includes(toolName);
  }

  /**
   * 特定のツール用ファイルを生成
   */
  async generateForTool(toolName) {
    if (!this.converters[toolName]) {
      throw new Error(`Unknown tool: ${toolName}`);
    }

    if (!this.config.targets[toolName]?.enabled) {
      throw new Error(`Tool ${toolName} is disabled`);
    }

    // ルールファイルを解析
    const parser = new RuleParser(this.config);
    const unifiedRules = await parser.parseRulesDirectory();
    
    if (unifiedRules.length === 0) {
      throw new Error('No rule files found in .arb/rules/');
    }

    const converter = this.converters[toolName];
    let result;
    if (typeof converter.generateFromRules === 'function' && toolName !== 'copilot' && toolName !== 'windsurf' && toolName !== 'cursor' && toolName !== 'claude' && toolName !== 'cline') {
      const singleFile = converter.generateFromRules(unifiedRules);
      result = await converter.writeFiles(singleFile);
    } else {
      let converted;
      if (this.supportMultipleFiles(toolName)) {
        converted = unifiedRules.map(rule => converter.convert(rule));
      } else {
        const mergedRule = parser.mergeRules(unifiedRules);
        if (!mergedRule) {
          throw new Error('Failed to merge rule files');
        }
        converted = converter.convert(mergedRule);
      }
      result = await converter.writeFiles(converted);
    }
    return result;
  }

  static async generateAll(config) {
    const generator = new Generator(config);
    return await generator.generateAll();
  }

  static async generateForTool(toolName, config) {
    const generator = new Generator(config);
    return await generator.generateForTool(toolName);
  }
}

module.exports = { Generator }; 