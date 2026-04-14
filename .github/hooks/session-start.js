#!/usr/bin/env node

/**
 * Hook: SessionStart
 * Initializes orchestration context when a session begins
 * Reads from stdin, outputs to stdout
 */

const fs = require('fs');
const path = require('path');

// Read hook input from stdin
let input = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', chunk => {
  input += chunk;
});

process.stdin.on('end', () => {
  try {
    const hookData = JSON.parse(input);
    const { agentName, sessionId, userMessage } = hookData;

    // Determine workflow phase based on agent
    let context = {
      orchestrationEnabled: true,
      sessionId,
      agentName,
      phase: getWorkflowPhase(agentName),
      timestamp: new Date().toISOString(),
      logFile: `.github/hooks/.session-${sessionId}.log`
    };

    // Initialize workflow state file if orchestrationagent
    if (agentName === 'orchestrationagent') {
      const stateFile = `.github/hooks/.orchestration-state.json`;
      const state = {
        sessionId,
        startTime: new Date().toISOString(),
        agents: {},
        progression: {
          planning: 'pending',
          backend: 'pending',
          frontend: 'pending',
          testing: 'pending',
          security: 'pending',
          completion: 'pending'
        },
        currentPhase: 'planning'
      };

      if (!fs.existsSync(path.dirname(stateFile))) {
        fs.mkdirSync(path.dirname(stateFile), { recursive: true });
      }
      fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
    }

    // Output success
    const output = {
      continue: true,
      systemMessage: `[ORCHᴐ] Session started - Agent: ${agentName}, Phase: ${context.phase}`
    };

    process.stdout.write(JSON.stringify(output));
    process.exit(0);
  } catch (error) {
    const output = {
      stopReason: 'HOOK_ERROR',
      systemMessage: `[ORCHᴐ] Hook error: ${error.message}`
    };
    process.stdout.write(JSON.stringify(output));
    process.exit(2); // Blocking error
  }
});

function getWorkflowPhase(agentName) {
  const phases = {
    'scrummaster': 'planning',
    'backendagent': 'backend',
    'archagent': 'frontend',
    'qaagent': 'testing',
    'secopsagent': 'security',
    'orchestrationagent': 'orchestration'
  };
  return phases[agentName] || 'unknown';
}
