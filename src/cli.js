#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const { initProject } = require('./core/init');
const { Generator } = require('./core/generator');
const { RuleParser } = require('./core/parser');
const { checkStatus } = require('./core/status');
const { logger } = require('./utils/logger');

const program = new Command();

program
  .name('arb')
  .description('AIRuleBridge - AI development tools rule management CLI')
  .version('1.0.0');

// init コマンド
program
  .command('init')
  .argument('[project-name]', 'Project name (optional)')
  .description('Initialize AIRuleBridge project with default configuration')
  .action(async (projectName) => {
    try {
      logger.info('Initializing AIRuleBridge project...');
      await initProject(projectName);
      logger.success('Project initialized successfully!');
    } catch (error) {
      logger.error('Failed to initialize project:', error.message);
      process.exit(1);
    }
  });

// generate コマンド
program
  .command('generate')
  .description('Generate AI tool files from .arb/rules/')
  .option('--openai-codex', 'Generate only for OpenAI Codex')
  .option('--gemini-cli', 'Generate only for Gemini CLI')
  .action(async (options) => {
    try {
      logger.info('Generating AI tool files...');
      const parser = new RuleParser();
      const config = await parser.loadConfig();
      let results;
      if (options.openaiCodex) {
        results = { 'openai-codex': await Generator.generateForTool('openai-codex', config) };
      } else if (options.geminiCli) {
        results = { 'gemini-cli': await Generator.generateForTool('gemini-cli', config) };
      } else {
        results = await Generator.generateAll(config);
      }
      
      // 結果表示
      Object.entries(results).forEach(([tool, result]) => {
        if (result.success) {
          logger.success(`✓ ${tool}: Generated successfully`);
        } else {
          logger.error(`✗ ${tool}: ${result.error}`);
        }
      });
      
      const successCount = Object.values(results).filter(r => r.success).length;
      const totalCount = Object.keys(results).length;
      
      if (successCount === totalCount) {
        logger.success(`All ${totalCount} tools generated successfully!`);
      } else {
        logger.warn(`${successCount}/${totalCount} tools generated successfully`);
      }
    } catch (error) {
      logger.error('Failed to generate files:', error.message);
      process.exit(1);
    }
  });

// status コマンド
program
  .command('status')
  .description('Check configuration status and diagnose issues')
  .action(async () => {
    try {
      logger.info('Checking AIRuleBridge status...');
      const status = await checkStatus();
      
      // 設定状況表示
      logger.info('\n=== Configuration Status ===');
      logger.info(`Project: ${status.project.name || 'Not configured'}`);
      logger.info(`Config file: ${status.configExists ? '✓ Found' : '✗ Missing'}`);
      logger.info(`Rules directory: ${status.rulesExists ? '✓ Found' : '✗ Missing'}`);
      logger.info(`Rules count: ${status.rulesCount}`);
      
      // ツール状況表示
      logger.info('\n=== Target Tools ===');
      Object.entries(status.tools).forEach(([tool, info]) => {
        const enabled = info.enabled ? '✓' : '✗';
        const toolStatus = info.outputExists ? 'exists' : 'missing';
        logger.info(`${enabled} ${tool}: ${info.output} (${toolStatus})`);
      });
      
      // 問題診断
      if (status.issues.length > 0) {
        logger.warn('\n=== Issues Found ===');
        status.issues.forEach(issue => logger.warn(`⚠ ${issue}`));
      } else {
        logger.success('\n✓ No issues found');
      }
    } catch (error) {
      logger.error('Failed to check status:', error.message);
      process.exit(1);
    }
  });

// help コマンド（デフォルトで提供されるが、カスタマイズ）
program
  .command('help')
  .description('Display help information')
  .action(() => {
    console.log(chalk.cyan('\nAIRuleBridge - AI development tools rule management CLI\n'));
    console.log('Usage:');
    console.log('  arb init [project-name]  Initialize project with default configuration');
    console.log('  arb generate             Generate AI tool files from .arb/rules/');
    console.log('  arb status               Check configuration status and diagnose issues');
    console.log('  arb help                 Display this help information');
    console.log('\nFor more information, visit: https://github.com/yourusername/ai-rule-bridge');
  });

// エラーハンドリング
program.on('command:*', () => {
  logger.error(`Unknown command: ${program.args.join(' ')}`);
  logger.info('Run "arb help" for available commands');
  process.exit(1);
});

// プログラム実行
if (process.argv.length === 2) {
  program.outputHelp();
} else {
  program.parse();
} 