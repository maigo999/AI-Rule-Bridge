const { fileUtils } = require('../utils/file-utils');
const { logger } = require('../utils/logger');

/**
 * 変換器の基底クラス
 */
class BaseConverter {
  constructor(config, toolName) {
    this.config = config;
    this.toolName = toolName;
    this.toolConfig = config.targets[toolName];
  }

  /**
   * 統一データから各ツール形式に変換（サブクラスで実装）
   */
  convert(_unifiedRule) {
    throw new Error('convert method must be implemented by subclass');
  }

  /**
   * 複数ルールから単一ファイルを生成（単一ファイルコンバータで実装）
   */
  generateFromRules(_unifiedRules) {
    throw new Error('generateFromRules method must be implemented by subclass');
  }

  /**
   * ファイルを書き込み
   */
  async writeFiles(convertedData) {
    if (!this.toolConfig.enabled) {
      return { success: false, error: 'Tool is disabled' };
    }

    try {
      // データを配列に正規化
      const dataArray = Array.isArray(convertedData) ? convertedData : [convertedData];
      
      // バックアップ作成（設定で有効な場合）
      if (this.config.versioning?.backup_existing) {
        await this.createBackups(dataArray);
      }

      // ファイル書き込み
      for (const data of dataArray) {
        await fileUtils.writeFile(data.path, data.content);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * バックアップファイルを作成
   */
  async createBackups(dataArray) {
    for (const data of dataArray) {
      if (await fileUtils.exists(data.path)) {
        const backupPath = await fileUtils.createBackup(data.path);
        if (backupPath) {
          logger.debug(`Created backup: ${backupPath}`);
        }
      }
    }
  }

  /**
   * 出力パスを取得
   */
  getOutputPath(filename = '') {
    const output = this.toolConfig.output;
    
    if (output.endsWith('/')) {
      // ディレクトリの場合
      return output + filename;
    } else {
      // ファイルの場合
      return output;
    }
  }

  /**
   * 制限チェック
   */
  checkLimits(content) {
    if (!this.toolConfig.limits) {
      return { valid: true, issues: [] };
    }

    const charCount = fileUtils.countChars(content);
    const issues = [];

    if (this.toolConfig.limits.max_file_chars && charCount > this.toolConfig.limits.max_file_chars) {
      issues.push(`Content exceeds max file chars: ${charCount} > ${this.toolConfig.limits.max_file_chars}`);
    }

    if (this.toolConfig.limits.max_total_chars && charCount > this.toolConfig.limits.max_total_chars) {
      issues.push(`Content exceeds max total chars: ${charCount} > ${this.toolConfig.limits.max_total_chars}`);
    }

    return {
      valid: issues.length === 0,
      issues,
      charCount
    };
  }

  /**
   * コンテンツを制限に合わせて切り詰め
   */
  truncateContent(content, maxChars) {
    if (content.length <= maxChars) {
      return content;
    }

    const truncated = content.substring(0, maxChars - 100); // 余裕を持って切り詰め
    const lastNewline = truncated.lastIndexOf('\n');
    
    if (lastNewline > 0) {
      return truncated.substring(0, lastNewline) + '\n\n[Content truncated due to length limits]';
    }
    
    return truncated + '\n\n[Content truncated due to length limits]';
  }
}

module.exports = { BaseConverter }; 