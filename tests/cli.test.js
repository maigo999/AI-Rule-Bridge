const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

describe('CLI Commands', () => {
  const testDir = path.join(__dirname, 'temp');
  
  beforeEach(async () => {
    // テスト用ディレクトリを作成
    await fs.ensureDir(testDir);
    process.chdir(testDir);
  });

  afterEach(async () => {
    // テスト用ディレクトリを削除
    process.chdir(__dirname);
    await fs.remove(testDir);
  });

  test('arb help should display help information', () => {
    const output = execSync('node ../src/cli.js help', { encoding: 'utf8' });
    expect(output).toContain('AIRuleBridge');
    expect(output).toContain('Usage:');
  });

  test('arb init should create configuration files', async () => {
    execSync('node ../src/cli.js init test-project', { encoding: 'utf8' });
    
    // 設定ファイルが作成されているかチェック
    expect(await fs.exists('.arb/config.yaml')).toBe(true);
    expect(await fs.exists('.arb/rules')).toBe(true);
    expect(await fs.exists('.arb/rules/project-rules.md')).toBe(true);
  });

  test('arb status should check project status', async () => {
    // 初期化せずにstatusを実行
    const output = execSync('node ../src/cli.js status', { encoding: 'utf8' });
    expect(output).toContain('Configuration file not found');
  });
}); 