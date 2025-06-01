const { BaseConverter } = require('./base-converter');

/**
 * VS Code Copilot変換器（複数ファイル形式対応）
 */
class CopilotConverter extends BaseConverter {
  constructor(config) {
    super(config, 'copilot');
  }

  /**
   * 統一ルールをCopilot形式に変換
   */
  convert(unifiedRule) {
    if (!unifiedRule) {
      throw new Error('No unified rule provided');
    }

    const content = this.formatContent(unifiedRule);
    const filename = this.generateFilename(unifiedRule);
    const outputPath = this.getOutputPath(filename);

    return {
      path: outputPath,
      content: content
    };
  }

  /**
   * Copilot用にコンテンツをフォーマット（新しいインストラクションファイル形式）
   */
  formatContent(unifiedRule) {
    // VS Code Copilotの新しいインストラクションファイル形式
    const metadata = unifiedRule.metadata;
    
    // フロントマターを生成
    let frontmatter = '---\n';
    
    if (metadata.globs.length > 0) {
      // globsパターンがある場合はapplyToとして設定
      frontmatter += `applyTo: "${metadata.globs[0]}"\n`;
    }
    
    frontmatter += '---\n\n';
    
    const content = unifiedRule.content.raw;
    return frontmatter + content;
  }

  /**
   * ファイル名を生成
   */
  generateFilename(unifiedRule) {
    if (unifiedRule.metadata && unifiedRule.metadata.name) {
      // ルール名をファイル名に変換（小文字、ハイフン区切り）
      const safeName = unifiedRule.metadata.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      return `${safeName}.instructions.md`;
    }
    
    return 'general.instructions.md';
  }
}

module.exports = { CopilotConverter }; 