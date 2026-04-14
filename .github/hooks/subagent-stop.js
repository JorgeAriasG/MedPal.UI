#!/usr/bin/env node

/**
 * Hook: SubagentStop
 * Validates subagent output and triggers automatic handoff to next phase
 * Handles workflow progression: planning → backend → frontend → testing → security
 */

const fs = require('fs');
const path = require('path');

let input = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', chunk => {
  input += chunk;
});

process.stdin.on('end', () => {
  try {
    const hookData = JSON.parse(input);
    const { agentName, sessionId, output, requestBody } = hookData;

    // Get workflow state
    const stateFile = `.github/hooks/.orchestration-state.json`;
    let state = {};
    if (fs.existsSync(stateFile)) {
      state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    }

    // Mark agent as complete
    state.agents = state.agents || {};
    state.agents[agentName] = {
      status: 'completed',
      endTime: new Date().toISOString(),
      outputLength: output ? output.length : 0
    };

    // Determine next phase based on current agent
    const nextPhase = getNextPhase(agentName, state);

    let systemMessage = `[ORCHᴐ] ${agentName} completed ✓`;
    let decision = 'continue';

    if (nextPhase && nextPhase !== 'done') {
      // Auto-trigger next phase
      state.currentPhase = nextPhase;
      state.progression[nextPhase] = 'in-progress';

      systemMessage += `\n[ORCHᴐ] → Auto-advancing to next phase: ${nextPhase}`;
      systemMessage += `\n[ORCHᴐ] Suggested next command: @${getAgentForPhase(nextPhase)} [continue with your work]`;
    } else if (nextPhase === 'done') {
      systemMessage += `\n[ORCHᴐ] ✅ WORKFLOW COMPLETE!`;
      systemMessage += `\n[ORCHᴐ] Summary: All phases completed successfully`;
      state.status = 'completed';
    }

    // Save updated state
    if (!fs.existsSync(path.dirname(stateFile))) {
      fs.mkdirSync(path.dirname(stateFile), { recursive: true });
    }
    fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));

    const hookOutput = {
      continue: true,
      systemMessage,
      hookSpecificOutput: {
        nextPhase,
        workflowState: state.currentPhase
      }
    };

    process.stdout.write(JSON.stringify(hookOutput));
    process.exit(0);
  } catch (error) {
    const output = {
      continue: false,
      systemMessage: `[ORCHᴐ] Hook error: ${error.message}`
    };
    process.stdout.write(JSON.stringify(output));
    process.exit(0); // Non-blocking error
  }
});

function getNextPhase(currentAgent, state) {
  const phaseMap = {
    'scrummaster': { current: 'planning', next: 'backend' },
    'backendagent': { current: 'backend', next: 'frontend' },
    'archagent': { current: 'frontend', next: 'testing' },
    'qaagent': { current: 'testing', next: 'security' },
    'secopsagent': { current: 'security', next: 'done' }
  };

  const phaseInfo = phaseMap[currentAgent];
  if (!phaseInfo) return null;

  // Check if both backend AND frontend are done before testing
  if (phaseInfo.next === 'testing') {
    const backendDone = state.agents?.backendagent?.status === 'completed';
    const frontendDone = state.agents?.archagent?.status === 'completed';

    if (!backendDone || !frontendDone) {
      return null; // Wait for both to complete
    }
  }

  return phaseInfo.next;
}

function getAgentForPhase(phase) {
  const agents = {
    'backend': 'backendagent',
    'frontend': 'archagent',
    'testing': 'qaagent',
    'security': 'secopsagent',
    'completion': 'scrummaster'
  };
  return agents[phase] || 'orchestrationagent';
}
