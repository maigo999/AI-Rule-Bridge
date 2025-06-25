const { BaseConverter } = require('./base-converter');
const { fileUtils } = require('../utils/file-utils');

class GeminiCliConverter extends BaseConverter {
  constructor(config) {
    super(config, 'gemini-cli');
  }

  generateFromRules(rules) {
    const content = rules.map(rule => rule.content.raw).join('\n\n---\n\n');
    const outputPath = this.toolConfig.output;
    return { path: outputPath, content };
  }
}

module.exports = { GeminiCliConverter };
