import type { TemplateFile } from '../types.js';

export function getAuthConfig(authProvider: string): { files: TemplateFile[] } {
  const files: TemplateFile[] = [];

  switch (authProvider) {
    case 'better-auth':
      files.push(
        {
          path: 'apps/web/src/lib/auth.ts',
          content: `import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  database: {
    // Configure your database connection here
  },
  emailAndPassword: {
    enabled: true,
  },
});

export type Session = typeof auth.$Infer.Session;
`,
        },
        {
          path: 'apps/web/src/app/api/auth/[...all]/route.ts',
          content: `import { auth } from '@/lib/auth';

export const { GET, POST } = auth.handler;
`,
        }
      );
      break;

    case 'clerk':
      files.push(
        {
          path: 'apps/web/src/middleware.ts',
          content: `import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
`,
        },
        {
          path: 'apps/web/.env.example',
          content: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
`,
        }
      );
      break;

    case 'next-auth':
      files.push(
        {
          path: 'apps/web/src/lib/auth.ts',
          content: `import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
});
`,
        },
        {
          path: 'apps/web/src/app/api/auth/[...nextauth]/route.ts',
          content: `import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
`,
        },
        {
          path: 'apps/web/.env.example',
          content: `AUTH_SECRET=your_auth_secret
AUTH_GITHUB_ID=your_github_id
AUTH_GITHUB_SECRET=your_github_secret
`,
        }
      );
      break;

    case 'lucia':
      files.push({
        path: 'apps/web/src/lib/auth.ts',
        content: `import { Lucia } from 'lucia';

// Configure Lucia auth
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
  }
}
`,
      });
      break;
  }

  return { files };
}
