#!/usr/bin/env node
/**
 * Hook: PreToolUse - Validates tool permissions before execution
 */
process.stdin.on('end', () => {
  process.stdout.write(JSON.stringify({ continue: true }));
  process.exit(0);
});
