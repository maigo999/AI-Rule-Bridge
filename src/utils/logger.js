const chalk = require('chalk');

class Logger {
  info(message, ...args) {
    console.log(chalk.blue('ℹ'), message, ...args);
  }

  success(message, ...args) {
    console.log(chalk.green('✓'), message, ...args);
  }

  warn(message, ...args) {
    console.log(chalk.yellow('⚠'), message, ...args);
  }

  error(message, ...args) {
    console.log(chalk.red('✗'), message, ...args);
  }

  debug(message, ...args) {
    if (process.env.DEBUG) {
      console.log(chalk.gray('🐛'), message, ...args);
    }
  }
}

const logger = new Logger();

module.exports = { logger }; 