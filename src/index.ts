#!/usr/bin/env node

import { intro, outro, text, select, multiselect, confirm, spinner, isCancel, cancel } from '@clack/prompts';
import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import { execa } from 'execa';
import { fileURLToPath } from 'url';
import { createProject } from './utils/create-project.js';
import { installDependencies } from './utils/install-deps.js';
import { initializeGit } from './utils/git.js';
import type { ProjectConfig } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name('create-noiriko')
  .description('Create a new noiriko monorepo project')
  .version('0.0.1')
  .argument('[project-name]', 'Name of the project')
  .option('--package-manager <pm>', 'Package manager to use (npm, pnpm, bun)')
  .option('--auth <auth>', 'Authentication provider (none, better-auth, clerk, next-auth)')
  .option('--database <db>', 'Database to use (none, sqlite, postgres, mysql)')
  .option('--orm <orm>', 'ORM to use (none, drizzle, prisma)')
  .option('--ui <ui>', 'UI library (shadcn)')
  .option('--git', 'Initialize git repository')
  .option('--install', 'Install dependencies automatically')
  .option('--skip-prompts', 'Skip interactive prompts and use defaults')
  .action(async (projectName, options) => {
    console.clear();
    
    intro(chalk.bgCyan(chalk.black(' create-noiriko ')));

    let config: ProjectConfig = {
      projectName: '',
      packageManager: 'pnpm',
      auth: 'none',
      database: 'none',
      orm: 'none',
      ui: 'shadcn',
      styling: 'tailwind',
      git: false,
      install: false,
      addons: [],
    };

    // Get project name
    if (!projectName) {
      const name = await text({
        message: 'What is your project named?',
        placeholder: 'my-noiriko-app',
        validate: (value) => {
          if (!value) return 'Project name is required';
          if (!/^[a-z0-9-]+$/.test(value)) {
            return 'Project name can only contain lowercase letters, numbers, and hyphens';
          }
          return;
        },
      });

      if (isCancel(name)) {
        cancel('Operation cancelled');
        process.exit(0);
      }

      config.projectName = name as string;
    } else {
      config.projectName = projectName;
    }

    // Check if directory already exists
    const projectPath = path.resolve(process.cwd(), config.projectName);
    if (fs.existsSync(projectPath)) {
      cancel(`Directory ${config.projectName} already exists`);
      process.exit(1);
    }

    if (!options.skipPrompts) {
      // Package Manager
      if (!options.packageManager) {
        const pm = await select({
          message: 'Which package manager would you like to use?',
          options: [
            { value: 'pnpm', label: 'pnpm (recommended)', hint: 'Fast, disk space efficient' },
            { value: 'npm', label: 'npm', hint: 'Node default' },
            { value: 'bun', label: 'bun', hint: 'Blazingly fast' },
            { value: 'yarn', label: 'yarn', hint: 'Classic choice' },
          ],
        });

        if (isCancel(pm)) {
          cancel('Operation cancelled');
          process.exit(0);
        }

        config.packageManager = pm as string;
      } else {
        config.packageManager = options.packageManager;
      }

      // Authentication
      if (!options.auth) {
        const auth = await select({
          message: 'Which authentication provider would you like to use?',
          options: [
            { value: 'none', label: 'None', hint: 'Set up authentication later' },
            { value: 'better-auth', label: 'Better Auth', hint: 'Modern, type-safe auth' },
            { value: 'clerk', label: 'Clerk', hint: 'Complete auth solution' },
            { value: 'next-auth', label: 'NextAuth.js', hint: 'Popular choice for Next.js' },
            { value: 'lucia', label: 'Lucia', hint: 'Lightweight auth library' },
          ],
        });

        if (isCancel(auth)) {
          cancel('Operation cancelled');
          process.exit(0);
        }

        config.auth = auth as string;
      } else {
        config.auth = options.auth;
      }

      // Database
      if (!options.database) {
        const db = await select({
          message: 'Which database would you like to use?',
          options: [
            { value: 'none', label: 'None', hint: 'No database setup' },
            { value: 'sqlite', label: 'SQLite', hint: 'Local file-based database' },
            { value: 'postgres', label: 'PostgreSQL', hint: 'Production-ready SQL' },
            { value: 'mysql', label: 'MySQL', hint: 'Popular SQL database' },
            { value: 'mongodb', label: 'MongoDB', hint: 'NoSQL document database' },
          ],
        });

        if (isCancel(db)) {
          cancel('Operation cancelled');
          process.exit(0);
        }

        config.database = db as string;
      } else {
        config.database = options.database;
      }

      // ORM (only if database is selected)
      if (config.database !== 'none' && !options.orm) {
        const orm = await select({
          message: 'Which ORM would you like to use?',
          options: [
            { value: 'drizzle', label: 'Drizzle ORM', hint: 'TypeScript-first ORM' },
            { value: 'prisma', label: 'Prisma', hint: 'Next-generation ORM' },
            { value: 'none', label: 'None', hint: 'Use raw SQL' },
          ],
        });

        if (isCancel(orm)) {
          cancel('Operation cancelled');
          process.exit(0);
        }

        config.orm = orm as string;
      } else if (options.orm) {
        config.orm = options.orm;
      }

      // Additional features
      const addons = await multiselect({
        message: 'Select additional features (space to select)',
        options: [
          { value: 'api', label: 'API Routes', hint: 'Add tRPC or REST API setup' },
          { value: 'email', label: 'Email', hint: 'React Email + Resend' },
          { value: 'payments', label: 'Payments', hint: 'Stripe integration' },
          { value: 'analytics', label: 'Analytics', hint: 'Vercel Analytics' },
          { value: 'seo', label: 'SEO', hint: 'Next SEO configuration' },
          { value: 'i18n', label: 'Internationalization', hint: 'Multi-language support' },
        ],
        required: false,
      });

      if (isCancel(addons)) {
        cancel('Operation cancelled');
        process.exit(0);
      }

      config.addons = addons as string[];

      // Git initialization
      if (!options.git) {
        const git = await confirm({
          message: 'Initialize a git repository?',
          initialValue: true,
        });

        if (isCancel(git)) {
          cancel('Operation cancelled');
          process.exit(0);
        }

        config.git = git as boolean;
      } else {
        config.git = options.git;
      }

      // Install dependencies
      if (!options.install) {
        const install = await confirm({
          message: 'Install dependencies?',
          initialValue: true,
        });

        if (isCancel(install)) {
          cancel('Operation cancelled');
          process.exit(0);
        }

        config.install = install as boolean;
      } else {
        config.install = options.install;
      }
    } else {
      // Use CLI options or defaults
      config.packageManager = options.packageManager || 'pnpm';
      config.auth = options.auth || 'none';
      config.database = options.database || 'none';
      config.orm = options.orm || 'none';
      config.git = options.git || false;
      config.install = options.install || false;
    }

    // Show configuration summary and confirm
    if (!options.skipPrompts) {
      console.log('\n' + chalk.bold('Configuration Summary:'));
      console.log(chalk.dim('─'.repeat(50)));
      console.log(chalk.cyan('  Project:        ') + chalk.white(config.projectName));
      console.log(chalk.cyan('  Package Manager:') + chalk.white(` ${config.packageManager}`));
      console.log(chalk.cyan('  Authentication: ') + chalk.white(config.auth));
      console.log(chalk.cyan('  Database:       ') + chalk.white(config.database));
      if (config.database !== 'none') {
        console.log(chalk.cyan('  ORM:            ') + chalk.white(config.orm));
      }
      if (config.addons.length > 0) {
        console.log(chalk.cyan('  Features:       ') + chalk.white(config.addons.join(', ')));
      }
      console.log(chalk.cyan('  Git:            ') + chalk.white(config.git ? 'Yes' : 'No'));
      console.log(chalk.cyan('  Install deps:   ') + chalk.white(config.install ? 'Yes' : 'No'));
      console.log(chalk.dim('─'.repeat(50)) + '\n');

      const confirmCreate = await confirm({
        message: 'Ready to create your project?',
        initialValue: true,
      });

      if (isCancel(confirmCreate) || !confirmCreate) {
        cancel('Project creation cancelled');
        process.exit(0);
      }
    }

    // Create project
    const s = spinner();
    s.start('Creating project structure...');

    try {
      await createProject(config, projectPath);
      s.stop('Project created!');

      // Initialize git
      if (config.git) {
        s.start('Initializing git repository...');
        await initializeGit(projectPath);
        s.stop('Git repository initialized!');
      }

      // Install dependencies
      if (config.install) {
        s.start(`Installing dependencies with ${config.packageManager}...`);
        await installDependencies(config.packageManager, projectPath);
        s.stop('Dependencies installed!');
      }

      outro(chalk.green('✓ Project created successfully!'));

      console.log('\n' + chalk.bold('Next steps:'));
      console.log(chalk.cyan(`  cd ${config.projectName}`));
      
      if (!config.install) {
        console.log(chalk.cyan(`  ${config.packageManager} install`));
      }
      
      // npm and yarn need 'run' before script name
      const devCommand = config.packageManager === 'npm' || config.packageManager === 'yarn' 
        ? `${config.packageManager} run dev` 
        : `${config.packageManager} dev`;
      console.log(chalk.cyan(`  ${devCommand}`));
      console.log('\n' + chalk.dim('Start building your application'));

    } catch (error) {
      s.stop('Failed to create project');
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program.parse();
