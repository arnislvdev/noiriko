import { execa } from 'execa';

export async function installDependencies(packageManager: string, projectPath: string): Promise<void> {
  const installCommand = getInstallCommand(packageManager);
  
  await execa(installCommand.command, installCommand.args, {
    cwd: projectPath,
    stdio: 'inherit',
  });
}

function getInstallCommand(packageManager: string): { command: string; args: string[] } {
  switch (packageManager) {
    case 'npm':
      return { command: 'npm', args: ['install'] };
    case 'pnpm':
      return { command: 'pnpm', args: ['install'] };
    case 'bun':
      return { command: 'bun', args: ['install'] };
    case 'yarn':
      return { command: 'yarn', args: [] };
    default:
      return { command: 'pnpm', args: ['install'] };
  }
}
