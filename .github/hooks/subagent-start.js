#!/usr/bin/env node
/**
 * Hook: SubagentStart - Logs subagent invocation and injects context
 */
const fs = require('fs');

let input = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', chunk => input += chunk);

process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const stateFile = `.github/hooks/.orchestration-state.json`;
    
    if (fs.existsSync(stateFile)) {
      const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
      
      process.stdout.write(JSON.stringify({
        continue: true,
        systemMessage: `[ORCHᴐ] → Delegating to @${data.name}...`
      }));
    } else {
      process.stdout.write(JSON.stringify({ continue: true }));
    }
  } catch (e) {
    process.stdout.write(JSON.stringify({ continue: true }));
  }
  process.exit(0);
});
