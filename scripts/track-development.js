#!/usr/bin/env node

/**
 * Track Development with Agentic Jujutsu
 *
 * Usage:
 *   npm run jj:start "feature description"
 *   ... do your work ...
 *   npm run jj:complete [success-score] [critique]
 *
 * Example:
 *   npm run jj:start "Implement user settings page"
 *   # Make changes...
 *   npm run jj:complete 0.85 "Feature works well, needs more tests"
 */

import { JjWrapper } from 'agentic-jujutsu';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jj = new JjWrapper();
const command = process.argv[2];

// State file to track current trajectory
const stateFile = path.join(__dirname, '../.jj-state.json');

function loadState() {
  if (fs.existsSync(stateFile)) {
    return JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  }
  return null;
}

function saveState(state) {
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

function clearState() {
  if (fs.existsSync(stateFile)) {
    fs.unlinkSync(stateFile);
  }
}

switch (command) {
  case 'start': {
    const task = process.argv[3];
    if (!task) {
      console.error('Usage: npm run jj:start "task description"');
      process.exit(1);
    }

    // Check if trajectory already active
    const state = loadState();
    if (state) {
      console.log('⚠️  Active trajectory already exists:', state.task);
      console.log('   Complete it first with: npm run jj:complete');
      process.exit(1);
    }

    // Get AI suggestion first
    console.log('🤖 Getting AI suggestion for:', task);
    const suggestion = JSON.parse(jj.getSuggestion(task));

    console.log('\n📊 AI Analysis:');
    console.log(`   Confidence: ${(suggestion.confidence * 100).toFixed(1)}%`);
    console.log(`   Expected Success: ${(suggestion.expectedSuccessRate * 100).toFixed(1)}%`);

    if (suggestion.confidence > 0.7) {
      console.log('\n✨ High confidence! Recommended approach:');
      console.log(suggestion.reasoning);
      console.log('\n📋 Suggested operations:');
      suggestion.recommendedOperations.forEach((op, i) => {
        console.log(`   ${i + 1}. ${op}`);
      });
    } else {
      console.log('\n⚠️  Low confidence - this is a new type of task.');
      console.log('   Your implementation will help train the AI!');
    }

    // Start trajectory
    const trajectoryId = jj.startTrajectory(task);

    saveState({
      trajectoryId,
      task,
      startTime: new Date().toISOString(),
      suggestion
    });

    console.log('\n🚀 Trajectory started!');
    console.log('   Work on your task, then run:');
    console.log('   npm run jj:complete [score] [critique]\n');
    break;
  }

  case 'complete': {
    const state = loadState();
    if (!state) {
      console.error('❌ No active trajectory. Start one with: npm run jj:start "task"');
      process.exit(1);
    }

    const score = parseFloat(process.argv[3]) || 0.8;
    const critique = process.argv.slice(4).join(' ') || 'Task completed';

    // Validate score
    if (score < 0 || score > 1) {
      console.error('❌ Score must be between 0.0 and 1.0');
      process.exit(1);
    }

    console.log('📝 Finalizing trajectory:', state.task);
    console.log(`   Score: ${(score * 100).toFixed(0)}%`);
    console.log(`   Critique: ${critique}`);

    // Record operations and finalize
    jj.addToTrajectory();
    jj.finalizeTrajectory(score, critique);

    // Calculate duration
    const duration = Math.round(
      (new Date() - new Date(state.startTime)) / 1000 / 60
    );

    console.log(`\n✅ Trajectory completed! (${duration} minutes)`);

    // Show updated stats
    const stats = JSON.parse(jj.getLearningStats());
    console.log('\n📊 Updated Learning Stats:');
    console.log(`   Total trajectories: ${stats.totalTrajectories}`);
    console.log(`   Average success: ${(stats.avgSuccessRate * 100).toFixed(1)}%`);
    console.log(`   Improvement rate: ${(stats.improvementRate * 100).toFixed(1)}%`);

    // Check if this created new patterns
    const patterns = JSON.parse(jj.getPatterns());
    const newPatterns = patterns.filter(p => p.observationCount === 1);
    if (newPatterns.length > 0) {
      console.log('\n🎯 New pattern discovered!');
      newPatterns.forEach(p => {
        console.log(`   - ${p.name} (${(p.confidence * 100).toFixed(0)}% confidence)`);
      });
    }

    clearState();
    console.log('\n💡 Next task will benefit from this learning!\n');
    break;
  }

  case 'status': {
    const state = loadState();
    if (!state) {
      console.log('📊 No active trajectory');
      const stats = JSON.parse(jj.getLearningStats());
      console.log(`\nTotal completed: ${stats.totalTrajectories}`);
      console.log(`Patterns learned: ${stats.totalPatterns}`);
    } else {
      const duration = Math.round(
        (new Date() - new Date(state.startTime)) / 1000 / 60
      );
      console.log('🔄 Active trajectory:');
      console.log(`   Task: ${state.task}`);
      console.log(`   Duration: ${duration} minutes`);
      console.log(`   AI Confidence: ${(state.suggestion.confidence * 100).toFixed(1)}%`);
    }
    break;
  }

  default:
    console.log('Available commands:');
    console.log('  npm run jj:start "task"           - Start tracking a task');
    console.log('  npm run jj:complete [score] [msg] - Complete current task');
    console.log('  npm run jj:status                 - Check active trajectory');
    console.log('\nExample workflow:');
    console.log('  npm run jj:start "Add dark mode toggle"');
    console.log('  # ... implement feature ...');
    console.log('  npm run jj:complete 0.9 "Works great, added tests"');
}
