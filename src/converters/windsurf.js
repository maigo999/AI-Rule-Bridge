const { BaseConverter } = require('./base-converter');

/**
 * Windsurf Cascade変換器
 */
class WindsurfConverter extends BaseConverter {
  constructor(config) {
    super(config, 'windsurf');
  }

  /**
   * 統一ルールをWindsurf形式に変換
   */
  convert(unifiedRule) {
    if (!unifiedRule) {
      throw new Error('No unified rule provided');
    }

    let content = this.formatContent(unifiedRule);
    
    // 文字数制限チェック
    const limitCheck = this.checkLimits(content);
    if (!limitCheck.valid) {
      // 制限を超えている場合は切り詰め
      const maxChars = this.toolConfig.limits.max_file_chars || this.toolConfig.limits.max_total_chars;
      content = this.truncateContent(content, maxChars);
    }

    const filename = `${unifiedRule.metadata.name}.md`;
    const outputPath = this.getOutputPath(filename);

    return {
      path: outputPath,
      content: content
    };
  }

  /**
   * Windsurf用にコンテンツをフォーマット
   */
  formatContent(unifiedRule) {
    const metadata = unifiedRule.metadata;
    
    // Windsurfのトリガータイプマッピング
    let trigger;
    switch (metadata.type) {
      case 'always':
        trigger = 'always_on';
        break;
      case 'auto':
        trigger = metadata.globs.length > 0 ? 'glob' : 'model_decision';
        break;
      case 'agent_requested':
        trigger = 'model_decision';
        break;
      case 'manual':
      default:
        trigger = 'manual';
        break;
    }

    // フロントマター生成
    let frontmatter = `---\ntrigger: ${trigger}`;
    
    if (metadata.description && (trigger === 'model_decision')) {
      frontmatter += `\ndescription: ${metadata.description}`;
    }
    
    if (metadata.globs.length > 0 && trigger === 'glob') {
      frontmatter += `\nglobs: ${metadata.globs.join(', ')}`;
    }
    
    frontmatter += '\n---';

    return frontmatter + '\n\n' + unifiedRule.content.raw;
  }
}

module.exports = { WindsurfConverter }; 