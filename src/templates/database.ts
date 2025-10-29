import type { TemplateFile } from '../types.js';

export function getDatabaseConfig(database: string, orm: string): { files: TemplateFile[] } {
  const files: TemplateFile[] = [];

  if (orm === 'drizzle') {
    files.push(
      {
        path: 'apps/web/src/lib/db/schema.ts',
        content: `import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
`,
      },
      {
        path: 'apps/web/src/lib/db/index.ts',
        content: `import { drizzle } from 'drizzle-orm/${getDrizzleDriver(database)}';
import * as schema from './schema';

export const db = drizzle(process.env.DATABASE_URL!, { schema });
`,
      },
      {
        path: 'apps/web/drizzle.config.ts',
        content: `import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: '${getDrizzleDriver(database)}',
  dbCredentials: {
    ${getDrizzleCredentials(database)}
  },
} satisfies Config;
`,
      },
      {
        path: 'apps/web/.env.example',
        content: `DATABASE_URL="${getDatabaseUrl(database)}"
`,
      }
    );
  } else if (orm === 'prisma') {
    files.push(
      {
        path: 'apps/web/prisma/schema.prisma',
        content: `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${getPrismaProvider(database)}"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String?
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`,
      },
      {
        path: 'apps/web/src/lib/db.ts',
        content: `import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
`,
      },
      {
        path: 'apps/web/.env.example',
        content: `DATABASE_URL="${getDatabaseUrl(database)}"
`,
      }
    );
  }

  return { files };
}

function getDrizzleDriver(database: string): string {
  switch (database) {
    case 'postgres':
      return 'postgres-js';
    case 'mysql':
      return 'mysql2';
    case 'sqlite':
      return 'better-sqlite3';
    default:
      return 'postgres-js';
  }
}

function getDrizzleCredentials(database: string): string {
  switch (database) {
    case 'postgres':
      return 'connectionString: process.env.DATABASE_URL!';
    case 'mysql':
      return 'connectionString: process.env.DATABASE_URL!';
    case 'sqlite':
      return 'url: process.env.DATABASE_URL!';
    default:
      return 'connectionString: process.env.DATABASE_URL!';
  }
}

function getPrismaProvider(database: string): string {
  switch (database) {
    case 'postgres':
      return 'postgresql';
    case 'mysql':
      return 'mysql';
    case 'sqlite':
      return 'sqlite';
    case 'mongodb':
      return 'mongodb';
    default:
      return 'postgresql';
  }
}

function getDatabaseUrl(database: string): string {
  switch (database) {
    case 'postgres':
      return 'postgresql://user:password@localhost:5432/dbname';
    case 'mysql':
      return 'mysql://user:password@localhost:3306/dbname';
    case 'sqlite':
      return 'file:./dev.db';
    case 'mongodb':
      return 'mongodb://localhost:27017/dbname';
    default:
      return 'postgresql://user:password@localhost:5432/dbname';
  }
}
