export interface ProjectConfig {
  projectName: string;
  packageManager: 'npm' | 'pnpm' | 'bun' | 'yarn' | string;
  auth: 'none' | 'better-auth' | 'clerk' | 'next-auth' | 'lucia' | string;
  database: 'none' | 'sqlite' | 'postgres' | 'mysql' | 'mongodb' | string;
  orm: 'none' | 'drizzle' | 'prisma' | string;
  ui: 'shadcn' | string;
  styling: 'tailwind' | string;
  git: boolean;
  install: boolean;
  addons: string[];
}

export interface TemplateFile {
  path: string;
  content: string;
}

export interface PackageJson {
  name: string;
  version: string;
  private?: boolean;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: any;
}
