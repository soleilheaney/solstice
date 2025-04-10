# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Local development: `npx sst dev` (NOTE: `pnpm dev` does not work for local development)
- Build: `pnpm build`
- Linting: `pnpm lint`
- Formatting: `pnpm format`
- Database schema: `pnpm db`
- Auth generation: `pnpm auth:generate`
- Deploy: `AWS_PROFILE=soleil-dev npx sst deploy --stage dev`

## Code Style Guidelines
- TypeScript with strict type checking
- React 19 with React Compiler
- Path aliases: Use `~/` for src directory imports
- Formatting: 
  - 2 space indentation
  - 90 character line limit
  - Double quotes for strings
  - Trailing commas
- Organize imports using prettier-plugin-organize-imports
- Component styling uses Tailwind CSS (v4) with shadcn/ui components
- Use TanStack Router for routing and TanStack Query for data fetching
- Database: Use Drizzle ORM with PostgreSQL
- Authentication: Use Better Auth
- Follow ESLint configuration with @eslint-react rules