import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';

export async function initializeGit(projectPath: string): Promise<void> {
  try {
    // Initialize git repository
    await execa('git', ['init'], { cwd: projectPath });
    
    // Create initial commit
    await execa('git', ['add', '.'], { cwd: projectPath });
    await execa('git', ['commit', '-m', 'Initial commit from create-noiriko'], { cwd: projectPath });
  } catch (error) {
    // Git might not be installed, fail silently
    console.warn('Failed to initialize git repository');
  }
}
