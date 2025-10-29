# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Fixed bug where API addon directory wasn't created before writing route file
- Fixed `packageManager` field to use specific version numbers instead of `@latest`
- Fixed npm workspace support - npm doesn't support `workspace:*` protocol, now uses `*` instead
- Fixed bun workspace support - added `workspaces` field to package.json for bun
- Fixed yarn version to use 1.22.22 (classic) instead of 4.5.3 for compatibility
- Fixed success message to show correct dev command (`npm run dev` instead of `npm dev`)
- Added `workspaces` field to root package.json for npm, yarn, and bun
- Fixed UI package.json to use dynamic workspace references
- Fixed Tailwind CSS styling not applying - reverted to stable v3 instead of beta v4
- Added all required Tailwind dependencies (postcss, autoprefixer, tailwindcss-animate)
- Only create pnpm-workspace.yaml for pnpm (others use package.json workspaces field)

### Added
- Added configuration summary before project creation
- Added confirmation prompt to review choices before proceeding
- ORM selection only shows when database is selected (smart filtering)

### Changed
- Removed emojis from generated homepage and CLI output
- Updated to professional, developer-focused language throughout
- Changed feature descriptions to be more technical and precise
- Improved CLI visual design with better formatting and colors

## [0.0.1] - 2025-10-29

### Added
- Initial release of create-noiriko CLI
- Interactive prompts for project configuration
- Support for multiple package managers (pnpm, npm, bun, yarn)
- Authentication options (Better Auth, Clerk, NextAuth, Lucia)
- Database support (PostgreSQL, MySQL, SQLite, MongoDB)
- ORM integration (Drizzle, Prisma)
- Additional features (API, Email, Payments, Analytics, SEO, i18n)
- Turborepo monorepo setup
- Next.js 15 with App Router
- Shadcn UI components
- TypeScript configuration
- Tailwind CSS styling
- Git initialization
- Automatic dependency installation
- CLI flags for non-interactive mode

---

## How to Update This Changelog

### Version Format
- **Major (x.0.0)**: Breaking changes
- **Minor (0.x.0)**: New features, backward compatible
- **Patch (0.0.x)**: Bug fixes

### Categories
- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security fixes

### Example Entry

```markdown
## [1.2.0] - 2025-10-29

### Added
- Support for Supabase authentication
- Docker configuration template
- GitHub Actions CI/CD template

### Changed
- Improved error messages in CLI
- Updated Next.js to version 15.1.0

### Fixed
- Fixed database template generation for MySQL
- Resolved TypeScript errors in auth templates

### Security
- Updated dependencies to patch security vulnerabilities
```
