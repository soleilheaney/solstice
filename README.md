# Quadball Canada Registration & Events Platform

## Overview and Purpose

The Quadball Canada Registration & Events Platform is a web application designed to streamline sports league management – initially serving **Quadball Canada** (the national quadball governing body) and eventually adaptable to other sports organizations. The platform enables athletes, team leaders, and administrators to handle all essential activities in one place.

**Key Features:**

- **Member Registration & Management:** User accounts, profiles, waivers, and annual memberships
- **Team Setup & Roster Management:** Team creation, player invitations, and roster management
- **Event Creation & Registration:** Tournament/league management with team/individual registration
- **Payments & Finance:** Integration with Stripe for membership and event fees
- **Role-Based Access Control:** Admin, Team Lead, and Player permission layers
- **Communication & Notifications:** Email confirmations and announcements
- **Future Extensibility:** Multi-organization, multi-sport capability

## Tech Stack and Architecture

- **TanStack Start (React framework):** Type-safe React framework with file-based routing and SSR
- **AWS Lambda via SST (Serverless Stack):** Serverless deployment with infrastructure as code
- **Drizzle ORM + PostgreSQL:** Type-safe database client with PostgreSQL
- **Authentication Provider (Better Auth):** Authentication handling with multiple providers
- **UI and Frontend Libraries:** Tailwind CSS v4 with shadcn/ui components
- **React 19 + React Compiler:** Latest React features and optimizations
- **TanStack Router + Query:** Type-safe routing and data fetching

## Project Structure

- `src/` – TanStack Start application
  - `routes/` – Page and API route components with file-based routing
  - `components/` – Reusable UI components
  - `lib/` – Utility functions, server code, and auth
- `drizzle/` – Database schema and migrations
- `sst.config.ts` – SST configuration and AWS resource definitions

## Local Development Setup

### Prerequisites

- Node.js (>=18) and npm/pnpm
- PostgreSQL 17 (for local development)
- AWS CLI configured (for deployment)

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/quadball-platform.git
   cd quadball-platform
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up PostgreSQL database:**
   ```bash
   # Install PostgreSQL (if not already installed)
   brew install postgresql@17
   
   # Start PostgreSQL service
   brew services start postgresql@17
   
   # Create database user and set password
   createuser -s postgres
   psql -c "ALTER USER postgres WITH PASSWORD 'postgres';" postgres
   
   # Create the application database
   createdb -U postgres solstice
   ```

4. **Configure AWS credentials and region**
   ```bash
   aws configure sso
   ```
   Or include manual credentials in `~/.aws/credentials` file
   Either way, use profile soleil-dev

5. **Run the development server:**
   ```bash
   pnpm dev
   ```
   Access the app at http://localhost:3000

## Deployment

Deploying to AWS is done via SST:

1. **Configure AWS credentials and region**
2. **Deploy with SST:**
   ```bash
   AWS_PROFILE=soleil-dev npx sst deploy --stage dev
   ```

## Implementation Plan

The project is divided into six phases, each with specific goals:

1. **Foundation Setup & User Authentication** - Basic infrastructure and auth flows
2. **Member Profiles & Membership Management** - User profiles and membership purchases
3. **Team Management** - Team creation and roster management
4. **Event Management & Registration** - Event creation and registration
5. **Communication & Advanced Features** - Dashboards, notifications, and UI polish
6. **Multi-Organization & Scalability** - Support for multiple organizations

Detailed tickets for each phase are available in the `tickets/` directory.

## Important Libraries and Documentation

This project uses several cutting-edge libraries that are relatively new:

1. **TanStack Start (v1.115+)**: 
   - Documentation: https://tanstack.com/start/latest/docs/framework/react/overview
   - Changes to beta: https://github.com/TanStack/router/discussions/2863 
   - https://github.com/TanStack/router/tree/main/docs/start/framework/react
2. **TanStack Router (v1.115+)**:
   - Documentation: https://tanstack.com/router/latest/docs/framework/react/overview
   - https://github.com/TanStack/router/tree/main/docs/router

3. **React 19**:
   - Documentation: https://react.dev/blog/2024/12/05/react-19
   - https://github.com/reactjs/react.dev

4. **React Compiler**:
   - Documentation: https://react.dev/learn/react-compiler

5. **Better Auth**:
   - Documentation: https://www.better-auth.com/docs/introduction
   - https://github.com/better-auth/better-auth/
   - https://www.better-auth.com/llms.txt

6. **Drizzle ORM**:
   - Documentation: https://orm.drizzle.team/docs/overview
   - https://github.com/drizzle-team/drizzle-orm
   - https://orm.drizzle.team/llms-full.txt

7. **Tailwind CSS v4**:
   - Documentation: https://tailwindcss.com/docs/installation/using-vite
   - https://github.com/tailwindlabs/tailwindcss

8. **SST (Serverless Stack)**:
   - Documentation: https://sst.dev/docs/
   - https://github.com/sst/sst

## Getting Started with Development

To begin implementation:
1. Review the Phase 1 tickets in detail
2. Set up your development environment following the instructions above
3. Start with the foundation setup tickets


https://github.com/idosal/git-mcp