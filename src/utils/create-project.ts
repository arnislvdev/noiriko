import fs from 'fs-extra';
import path from 'path';
import type { ProjectConfig, PackageJson } from '../types.js';
import { getBaseTemplate } from '../templates/base.js';
import { getAuthConfig } from '../templates/auth.js';
import { getDatabaseConfig } from '../templates/database.js';

export async function createProject(config: ProjectConfig, projectPath: string): Promise<void> {
  // Create project directory
  await fs.ensureDir(projectPath);

  // Copy base template
  await createBaseStructure(config, projectPath);

  // Add authentication if selected
  if (config.auth !== 'none') {
    await addAuthConfiguration(config, projectPath);
  }

  // Add database if selected
  if (config.database !== 'none') {
    await addDatabaseConfiguration(config, projectPath);
  }

  // Add additional features
  for (const addon of config.addons) {
    await addAddon(addon, config, projectPath);
  }

  // Create package.json files
  await createPackageJsonFiles(config, projectPath);

  // Create configuration files
  await createConfigFiles(config, projectPath);
}

async function createBaseStructure(config: ProjectConfig, projectPath: string): Promise<void> {
  const template = getBaseTemplate(config);

  // Create directory structure
  const dirs = [
    'apps/web',
    'apps/web/src/app',
    'apps/web/src/components',
    'apps/web/src/lib',
    'apps/web/public',
    'packages/ui/src',
    'packages/ui/src/components',
    'packages/eslint-config',
    'packages/typescript-config',
  ];

  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }

  // Create files from template
  for (const file of template.files) {
    const filePath = path.join(projectPath, file.path);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, file.content);
  }
}

async function addAuthConfiguration(config: ProjectConfig, projectPath: string): Promise<void> {
  const authConfig = getAuthConfig(config.auth);
  
  for (const file of authConfig.files) {
    const filePath = path.join(projectPath, file.path);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, file.content);
  }
}

async function addDatabaseConfiguration(config: ProjectConfig, projectPath: string): Promise<void> {
  const dbConfig = getDatabaseConfig(config.database, config.orm);
  
  for (const file of dbConfig.files) {
    const filePath = path.join(projectPath, file.path);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, file.content);
  }
}

async function addAddon(addon: string, config: ProjectConfig, projectPath: string): Promise<void> {
  // Implement addon-specific logic
  switch (addon) {
    case 'api':
      await addApiSetup(config, projectPath);
      break;
    case 'email':
      await addEmailSetup(config, projectPath);
      break;
    case 'payments':
      await addPaymentsSetup(config, projectPath);
      break;
    case 'analytics':
      await addAnalyticsSetup(config, projectPath);
      break;
    case 'seo':
      await addSeoSetup(config, projectPath);
      break;
    case 'i18n':
      await addI18nSetup(config, projectPath);
      break;
  }
}

async function addApiSetup(config: ProjectConfig, projectPath: string): Promise<void> {
  const helloApiDir = path.join(projectPath, 'apps/web/src/app/api/hello');
  await fs.ensureDir(helloApiDir);
  
  const routeContent = `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello from API' });
}
`;
  
  await fs.writeFile(path.join(helloApiDir, 'route.ts'), routeContent);
}

async function addEmailSetup(config: ProjectConfig, projectPath: string): Promise<void> {
  const emailDir = path.join(projectPath, 'packages/email');
  await fs.ensureDir(emailDir);
  // Add email templates and configuration
}

async function addPaymentsSetup(config: ProjectConfig, projectPath: string): Promise<void> {
  const paymentsDir = path.join(projectPath, 'apps/web/src/lib/payments');
  await fs.ensureDir(paymentsDir);
  // Add Stripe configuration
}

async function addAnalyticsSetup(config: ProjectConfig, projectPath: string): Promise<void> {
  // Add analytics configuration to layout
}

async function addSeoSetup(config: ProjectConfig, projectPath: string): Promise<void> {
  // Add SEO configuration
}

async function addI18nSetup(config: ProjectConfig, projectPath: string): Promise<void> {
  const i18nDir = path.join(projectPath, 'apps/web/src/i18n');
  await fs.ensureDir(i18nDir);
  // Add i18n configuration
}

async function createPackageJsonFiles(config: ProjectConfig, projectPath: string): Promise<void> {
  // Get specific package manager version
  const getPackageManagerVersion = (pm: string): string => {
    switch (pm) {
      case 'pnpm':
        return 'pnpm@10.4.1';
      case 'npm':
        return 'npm@10.8.2';
      case 'yarn':
        return 'yarn@1.22.22'; // Use Yarn 1 (classic) for compatibility
      case 'bun':
        return 'bun@1.1.38';
      default:
        return 'pnpm@10.4.1';
    }
  };

  // Helper to get workspace reference based on package manager
  const getWorkspaceRef = (pm: string): string => {
    // npm and yarn classic use *, pnpm/bun use workspace:*
    return (pm === 'npm' || pm === 'yarn') ? '*' : 'workspace:*';
  };

  // Root package.json
  const rootPackage: PackageJson = {
    name: config.projectName,
    version: '0.0.1',
    private: true,
    scripts: {
      build: 'turbo build',
      dev: 'turbo dev',
      lint: 'turbo lint',
      format: 'prettier --write "**/*.{ts,tsx,md}"',
    },
    devDependencies: {
      '@workspace/eslint-config': getWorkspaceRef(config.packageManager),
      '@workspace/typescript-config': getWorkspaceRef(config.packageManager),
      prettier: '^3.6.2',
      turbo: '^2.5.5',
      typescript: '5.7.3',
    },
    packageManager: getPackageManagerVersion(config.packageManager),
    engines: {
      node: '>=20',
    },
  };

  // Add workspaces field for npm/yarn/bun (pnpm uses pnpm-workspace.yaml)
  if (config.packageManager === 'npm' || config.packageManager === 'yarn' || config.packageManager === 'bun') {
    rootPackage.workspaces = ['apps/*', 'packages/*'];
  }

  await fs.writeJson(path.join(projectPath, 'package.json'), rootPackage, { spaces: 2 });

  // Web app package.json
  const webPackage: PackageJson = {
    name: '@workspace/web',
    version: '0.0.1',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      '@workspace/ui': getWorkspaceRef(config.packageManager),
      next: '^15.1.3',
      react: '^19.0.0',
      'react-dom': '^19.0.0',
    },
    devDependencies: {
      '@types/node': '^20.11.19',
      '@types/react': '^19.0.0',
      '@types/react-dom': '^19.0.0',
      '@workspace/eslint-config': getWorkspaceRef(config.packageManager),
      '@workspace/typescript-config': getWorkspaceRef(config.packageManager),
      autoprefixer: '^10.4.20',
      postcss: '^8.4.49',
      tailwindcss: '^3.4.17',
      'tailwindcss-animate': '^1.0.7',
      typescript: '5.7.3',
    },
  };

  // Add auth dependencies
  if (config.auth === 'better-auth') {
    webPackage.dependencies!['better-auth'] = '^1.0.0';
  } else if (config.auth === 'clerk') {
    webPackage.dependencies!['@clerk/nextjs'] = '^6.0.0';
  } else if (config.auth === 'next-auth') {
    webPackage.dependencies!['next-auth'] = '^5.0.0';
  }

  // Add database dependencies
  if (config.orm === 'drizzle') {
    webPackage.dependencies!['drizzle-orm'] = '^0.36.0';
    webPackage.devDependencies!['drizzle-kit'] = '^0.28.0';
  } else if (config.orm === 'prisma') {
    webPackage.dependencies!['@prisma/client'] = '^6.0.0';
    webPackage.devDependencies!['prisma'] = '^6.0.0';
  }

  await fs.writeJson(path.join(projectPath, 'apps/web/package.json'), webPackage, { spaces: 2 });

  // UI package package.json
  const uiPackage: PackageJson = {
    name: '@workspace/ui',
    version: '0.0.1',
    private: true,
    exports: {
      './button': './src/components/button.tsx',
      './card': './src/components/card.tsx',
    },
    scripts: {
      lint: 'eslint . --max-warnings 0',
    },
    dependencies: {
      'class-variance-authority': '^0.7.0',
      clsx: '^2.1.1',
      'tailwind-merge': '^2.5.5',
    },
    devDependencies: {
      '@types/react': '^19.0.0',
      '@workspace/eslint-config': getWorkspaceRef(config.packageManager),
      '@workspace/typescript-config': getWorkspaceRef(config.packageManager),
      react: '^19.0.0',
      typescript: '5.7.3',
    },
    peerDependencies: {
      react: '^19.0.0',
    },
  };

  await fs.writeJson(path.join(projectPath, 'packages/ui/package.json'), uiPackage, { spaces: 2 });
}

async function createConfigFiles(config: ProjectConfig, projectPath: string): Promise<void> {
  // Create workspace config based on package manager
  if (config.packageManager === 'pnpm') {
    const workspaceConfig = `packages:
  - 'apps/*'
  - 'packages/*'
`;
    await fs.writeFile(path.join(projectPath, 'pnpm-workspace.yaml'), workspaceConfig);
  }
  
  // Note: npm and yarn use the workspaces field in package.json (already added)
  // bun uses the same workspaces field as npm/yarn

  // turbo.json
  const turboConfig = {
    $schema: 'https://turbo.build/schema.json',
    ui: 'tui',
    tasks: {
      build: {
        dependsOn: ['^build'],
        inputs: ['$TURBO_DEFAULT$', '.env*'],
        outputs: ['.next/**', '!.next/cache/**'],
      },
      lint: {
        dependsOn: ['^lint'],
      },
      'check-types': {
        dependsOn: ['^check-types'],
      },
      dev: {
        cache: false,
        persistent: true,
      },
    },
  };

  await fs.writeJson(path.join(projectPath, 'turbo.json'), turboConfig, { spaces: 2 });

  // .gitignore
  const gitignore = `# dependencies
node_modules
.pnp
.pnp.js

# testing
coverage

# next.js
.next/
out/
build
dist/

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env*.local

# turbo
.turbo

# vercel
.vercel
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);

  // README.md
  const readme = `# ${config.projectName}

A modern monorepo built with:
- 🚀 **Turborepo** - High-performance build system
- ⚡ **Next.js 15** - React framework
- 🎨 **Shadcn UI** - Beautiful component library
- 🔐 **${config.auth !== 'none' ? config.auth : 'Ready for auth'}** - Authentication
- 🗄️ **${config.database !== 'none' ? config.database : 'Ready for database'}** - Database
- 📦 **${config.packageManager}** - Package manager

## Getting Started

\`\`\`bash
${config.packageManager} install
${config.packageManager} dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Project Structure

\`\`\`
${config.projectName}/
├── apps/
│   └── web/          # Next.js application
├── packages/
│   ├── ui/           # Shared UI components
│   ├── eslint-config/
│   └── typescript-config/
└── turbo.json
\`\`\`

## Available Scripts

- \`${config.packageManager} dev\` - Start development server
- \`${config.packageManager} build\` - Build for production
- \`${config.packageManager} lint\` - Run ESLint
- \`${config.packageManager} format\` - Format code with Prettier

## Learn More

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn UI](https://ui.shadcn.com)
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}
