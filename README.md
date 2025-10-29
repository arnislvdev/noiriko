# noiriko

A CLI tool for scaffolding production-ready monorepo projects with interactive configuration.

## Features

- **Turborepo** - High-performance build system with intelligent caching
- **Next.js 15** - Latest React framework with App Router
- **Shadcn UI** - Accessible component library built on Radix UI
- **Multiple Auth Options** - Better Auth, Clerk, NextAuth, Lucia
- **Database Support** - PostgreSQL, MySQL, SQLite, MongoDB
- **ORM Integration** - Drizzle or Prisma
- **Additional Features** - API routes, Email, Payments, Analytics, SEO, i18n
- **TypeScript First** - Full type safety across the monorepo
- **Tailwind CSS v4** - Modern utility-first styling

## Usage

### Interactive Mode (Recommended)

```bash
pnpm create noiriko@latest my-app
```

The CLI will guide you through selecting:
- Package manager (pnpm, npm, bun, yarn)
- Authentication provider
- Database and ORM
- Additional features
- Git initialization
- Dependency installation

### CLI Mode with Flags

```bash
pnpm create noiriko@latest my-app \
  --package-manager pnpm \
  --auth better-auth \
  --database postgres \
  --orm drizzle \
  --git \
  --install
```

### Available Options

```
Options:
  --package-manager <pm>  Package manager (npm, pnpm, bun, yarn)
  --auth <auth>          Authentication (none, better-auth, clerk, next-auth, lucia)
  --database <db>        Database (none, sqlite, postgres, mysql, mongodb)
  --orm <orm>            ORM (none, drizzle, prisma)
  --ui <ui>              UI library (shadcn)
  --git                  Initialize git repository
  --install              Install dependencies automatically
  --skip-prompts         Skip interactive prompts
  -h, --help             Display help
  -v, --version          Display version
```

## Example Commands

### Minimal Setup
```bash
pnpm create noiriko@latest my-app --skip-prompts
```

### Full Stack with Auth
```bash
pnpm create noiriko@latest my-app \
  --package-manager pnpm \
  --auth better-auth \
  --database postgres \
  --orm drizzle \
  --git \
  --install
```

### E-commerce Ready
```bash
pnpm create noiriko@latest my-store \
  --package-manager pnpm \
  --auth clerk \
  --database postgres \
  --orm prisma \
  --git \
  --install
```

## Project Structure

```
my-app/
├── apps/
│   └── web/              # Next.js application
│       ├── src/
│       │   ├── app/      # App Router pages
│       │   ├── components/
│       │   └── lib/      # Utilities and configs
│       ├── public/
│       └── package.json
├── packages/
│   ├── ui/               # Shared UI components (Shadcn)
│   ├── eslint-config/    # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

## After Installation

```bash
cd my-app
pnpm dev
```

Your app will be running at `http://localhost:3000`

## What's Included

### Base Setup
- ✅ Turborepo configuration
- ✅ Next.js 15 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Shadcn UI components
- ✅ ESLint & Prettier
- ✅ Shared packages architecture

### Optional Features
- 🔐 Authentication (Better Auth, Clerk, NextAuth, Lucia)
- 🗄️ Database & ORM (Drizzle, Prisma)
- 📧 Email (React Email + Resend)
- 💳 Payments (Stripe)
- 📊 Analytics (Vercel Analytics)
- 🔍 SEO (Next SEO)
- 🌍 i18n (Internationalization)

## Development

```bash
# Install dependencies
pnpm install

# Build the CLI
pnpm build

# Test locally
pnpm dev

# Link for local testing
npm link
```

## Publishing

```bash
# Build
pnpm build

# Publish to npm
npm publish
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Credits

Built with inspiration from:
- [create-t3-app](https://create.t3.gg/)
- [better-t-stack](https://better-t-stack.com/)
- [shadcn/ui](https://ui.shadcn.com/)
