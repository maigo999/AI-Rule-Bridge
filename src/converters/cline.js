const { BaseConverter } = require('./base-converter');

/**
 * Cline変換器
 */
class ClineConverter extends BaseConverter {
  constructor(config) {
    super(config, 'cline');
  }

  /**
   * 統一ルールをCline形式に変換
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
   * Cline用にコンテンツをフォーマット
   */
  formatContent(rawContent) {
    // Clineは単一ファイルのマークダウン形式
    const header = "# Cline Rule";

    return header + "\n" + rawContent;
  }
}

module.exports = { ClineConverter }; 