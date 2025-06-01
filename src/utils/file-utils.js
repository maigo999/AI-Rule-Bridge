const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

class FileUtils {
  /**
   * YAMLファイルを読み込む
   */
  async readYaml(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return yaml.load(content);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null; // ファイルが存在しない
      }
      throw error;
    }
  }

  /**
   * YAMLファイルに書き込む
   */
  async writeYaml(filePath, data) {
    const yamlContent = yaml.dump(data, {
      indent: 2,
      lineWidth: -1,
      noRefs: true
    });
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, yamlContent, 'utf8');
  }

  /**
   * Markdownファイルを読み込む
   */
  async readMarkdown(filePath) {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  /**
   * ファイルに書き込む（ディレクトリも自動作成）
   */
  async writeFile(filePath, content) {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf8');
  }

  /**
   * ディレクトリ内のMarkdownファイルを取得
   */
  async getMarkdownFiles(dirPath) {
    try {
      const files = await fs.readdir(dirPath);
      return files
        .filter(file => file.endsWith('.md'))
        .map(file => path.join(dirPath, file));
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  /**
   * ファイルまたはディレクトリの存在確認
   */
  async exists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * ディレクトリかどうか確認
   */
  async isDirectory(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * ファイルサイズを取得（バイト）
   */
  async getFileSize(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch {
      return 0;
    }
  }

  /**
   * 文字数をカウント
   */
  countChars(content) {
    return content.length;
  }

  /**
   * バックアップファイルを作成
   */
  async createBackup(filePath) {
    if (await this.exists(filePath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = `${filePath}.backup.${timestamp}`;
      await fs.copy(filePath, backupPath);
      return backupPath;
    }
    return null;
  }
}

const fileUtils = new FileUtils();

module.exports = { fileUtils }; 