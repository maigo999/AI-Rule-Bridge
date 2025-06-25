const { BaseConverter } = require('./base-converter');


class OpenAICodexConverter extends BaseConverter {
  constructor(config) {
    super(config, 'openai-codex');
  }

  generateFromRules(rules) {
    const content = rules.map(rule => rule.content.raw).join('\n\n---\n\n');
    const outputPath = this.toolConfig.output;
    return { path: outputPath, content };
  }
}

module.exports = { OpenAICodexConverter };
