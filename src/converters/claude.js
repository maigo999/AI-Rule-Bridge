const { BaseConverter } = require('./base-converter');

/**
 * Claude Code変換器
 */
class ClaudeConverter extends BaseConverter {
  constructor(config) {
    super(config, 'claude');
  }

  /**
   * 統一ルールをClaude形式に変換
   */
  convert(unifiedRule) {
    if (!unifiedRule) {
      throw new Error('No unified rule provided');
    }

    const content = this.formatContent(unifiedRule.content.raw);
    const outputPath = this.getOutputPath();

    return {
      path: outputPath,
      content: content
    };
  }

  /**
   * Claude用にコンテンツをフォーマット
   */
  formatContent(rawContent) {
    // Claudeはシンプルなマークダウン形式
    const header = "# Claude Code Rule";

    return header + "\n" + rawContent;
  }
}

module.exports = { ClaudeConverter }; 