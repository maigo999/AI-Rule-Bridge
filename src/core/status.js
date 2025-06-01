const path = require('path');
const { fileUtils } = require('../utils/file-utils');
const { RuleParser } = require('./parser');

/**
 * ステータス確認機能
 */
class StatusChecker {
  constructor() {
    this.configPath = 'arb.config.yaml';
    this.rulesDir = '.arb/rules';
  }

  /**
   * 全体的なステータスを確認
   */
  async checkStatus() {
    const status = {
      configExists: false,
      rulesExists: false,
      rulesCount: 0,
      project: {},
      tools: {},
      issues: []
    };

    // 設定ファイルの確認
    status.configExists = await fileUtils.exists(this.configPath);
    
    if (!status.configExists) {
      status.issues.push('Configuration file not found. Run "arb init" to initialize.');
      return status;
    }

    // 設定を読み込み
    let config;
    try {
      config = await fileUtils.readYaml(this.configPath);
      status.project = config.project || {};
    } catch (error) {
      status.issues.push(`Failed to read configuration: ${error.message}`);
      return status;
    }

    // ルールディレクトリの確認
    status.rulesExists = await fileUtils.exists(this.rulesDir);
    
    if (!status.rulesExists) {
      status.issues.push('Rules directory not found. Run "arb init" to create it.');
    } else {
      // ルールファイル数をカウント
      const markdownFiles = await fileUtils.getMarkdownFiles(this.rulesDir);
      status.rulesCount = markdownFiles.length;
      
      if (status.rulesCount === 0) {
        status.issues.push('No rule files found in .arb/rules/. Add some .md files.');
      }
    }

    // 各ツールの状況確認
    if (config.targets) {
      for (const [toolName, toolConfig] of Object.entries(config.targets)) {
        const toolStatus = await this.checkToolStatus(toolName, toolConfig);
        status.tools[toolName] = toolStatus;
        
        // ツール固有の問題をチェック
        const toolIssues = this.checkToolIssues(toolName, toolConfig, toolStatus);
        status.issues.push(...toolIssues);
      }
    }

    return status;
  }

  /**
   * 特定ツールのステータス確認
   */
  async checkToolStatus(toolName, toolConfig) {
    const status = {
      enabled: toolConfig.enabled || false,
      output: toolConfig.output,
      outputExists: false,
      limits: toolConfig.limits || null
    };

    if (toolConfig.output) {
      status.outputExists = await fileUtils.exists(toolConfig.output);
    }

    return status;
  }

  /**
   * ツール固有の問題をチェック
   */
  checkToolIssues(toolName, toolConfig, toolStatus) {
    const issues = [];

    // 出力パスの確認
    if (!toolConfig.output) {
      issues.push(`${toolName}: Output path not configured`);
    }

    // Windsurf固有の制限チェック
    if (toolName === 'windsurf' && toolConfig.enabled) {
      if (!toolConfig.limits) {
        issues.push(`${toolName}: Character limits not configured`);
      } else {
        if (!toolConfig.limits.max_file_chars) {
          issues.push(`${toolName}: max_file_chars limit not set`);
        }
        if (!toolConfig.limits.max_total_chars) {
          issues.push(`${toolName}: max_total_chars limit not set`);
        }
      }
    }

    return issues;
  }

  /**
   * ルールファイルの詳細分析
   */
  async analyzeRules() {
    if (!(await fileUtils.exists(this.rulesDir))) {
      return { files: [], totalChars: 0, issues: [] };
    }

    const markdownFiles = await fileUtils.getMarkdownFiles(this.rulesDir);
    const analysis = {
      files: [],
      totalChars: 0,
      issues: []
    };

    for (const filePath of markdownFiles) {
      try {
        const content = await fileUtils.readMarkdown(filePath);
        const charCount = fileUtils.countChars(content);
        
        analysis.files.push({
          path: filePath,
          name: path.basename(filePath, '.md'),
          charCount
        });
        
        analysis.totalChars += charCount;
      } catch (error) {
        analysis.issues.push(`Failed to read ${filePath}: ${error.message}`);
      }
    }

    return analysis;
  }

  /**
   * 設定の妥当性チェック
   */
  async validateConfig() {
    if (!(await fileUtils.exists(this.configPath))) {
      return { valid: false, issues: ['Configuration file not found'] };
    }

    const issues = [];
    
    try {
      const config = await fileUtils.readYaml(this.configPath);
      
      // 必須フィールドのチェック
      if (!config.version) {
        issues.push('Missing version field');
      }
      
      if (!config.project) {
        issues.push('Missing project configuration');
      }
      
      if (!config.targets) {
        issues.push('Missing targets configuration');
      } else {
        // 各ツールの設定チェック
        const requiredTools = ['copilot', 'windsurf', 'cursor', 'claude', 'cline'];
        for (const tool of requiredTools) {
          if (!config.targets[tool]) {
            issues.push(`Missing configuration for ${tool}`);
          }
        }
      }
      
    } catch (error) {
      issues.push(`Invalid YAML format: ${error.message}`);
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}

/**
 * ステータスを確認
 */
async function checkStatus() {
  const checker = new StatusChecker();
  return await checker.checkStatus();
}

/**
 * ルールファイルを分析
 */
async function analyzeRules() {
  const checker = new StatusChecker();
  return await checker.analyzeRules();
}

/**
 * 設定を検証
 */
async function validateConfig() {
  const checker = new StatusChecker();
  return await checker.validateConfig();
}

module.exports = { StatusChecker, checkStatus, analyzeRules, validateConfig }; 