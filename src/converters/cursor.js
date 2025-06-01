const { BaseConverter } = require('./base-converter');

/**
 * Cursor変換器
 */
class CursorConverter extends BaseConverter {
  constructor(config) {
    super(config, 'cursor');
  }

  /**
   * 統一ルールをCursor形式に変換
   */
  convert(unifiedRule) {
    if (!unifiedRule) {
      throw new Error('No unified rule provided');
    }

    const content = this.formatContent(unifiedRule);
    const filename = `${unifiedRule.metadata.name}.mdc`;
    const outputPath = this.getOutputPath(filename);

    return {
      path: outputPath,
      content: content
    };
  }

  /**
   * Cursor用にコンテンツをフォーマット（MDC形式）
   */
  formatContent(unifiedRule) {
    const metadata = unifiedRule.metadata;
    
    // Cursorのルールタイプマッピング
    const alwaysApply = metadata.type === 'always';
    const globs = metadata.globs.length > 0 ? metadata.globs : ['**'];
    
    const frontmatter = `---
description: ${metadata.description || ''}
globs: ${JSON.stringify(globs)}
alwaysApply: ${alwaysApply}
---`;

    return frontmatter + '\n' + unifiedRule.content.raw;
  }
}

module.exports = { CursorConverter }; 