#!/usr/bin/env node
/**
 * Hook: Stop - Generates session summary and next actions
 */
const fs = require('fs');

let input = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', chunk => input += chunk);

process.stdin.on('end', () => {
  try {
    const stateFile = `.github/hooks/.orchestration-state.json`;
    let summary = '[ORCHᴐ] Session Summary:\n';
    
    if (fs.existsSync(stateFile)) {
      const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
      
      summary += `├─ Current Phase: ${state.currentPhase}\n`;
      summary += `├─ Active Agents: ${Object.keys(state.agents).length}\n`;
      summary += `└─ Status: ${state.status || 'in-progress'}`;
    }

    process.stdout.write(JSON.stringify({
      continue: true,
      systemMessage: summary
    }));
  } catch (e) {
    process.stdout.write(JSON.stringify({ continue: true }));
  }
  process.exit(0);
});
