# Solstice

Solstice is a **modern web platform for managing memberships, teams, and events**. It leverages a cutting-edge tech stack to deliver fast, dynamic user experiences while being highly extensible.

## Overview and Purpose

The Solstice platform streamlines sports league management – initially serving **Quadball Canada** (the national quadball governing body) and eventually adaptable to other sports organizations. The platform enables athletes, team leaders, and administrators to handle all essential activities in one place.

**Key Features:**

- **Member Registration & Management:** User accounts, profiles, waivers, and annual memberships
- **Team Setup & Roster Management:** Team creation, player invitations, and roster management
- **Event Creation & Registration:** Tournament/league management with team/individual registration
- **Payments & Finance:** Integration with a payment platform for membership and event fees
- **Role-Based Access Control:** Admin, Team Lead, and Player permission layers
- **Communication & Notifications:** Email confirmations and announcements
- **Future Extensibility:** Multi-organization, multi-sport capability

## Getting Started

To set up the development environment for Solstice, follow these steps:

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

3. **Set up environment variables:** Copy `.env.example` to `.env` and fill in required secrets (database URL, OAuth client IDs/secrets, etc.). This includes credentials for GitHub/Google/Discord OAuth (if testing social logins) and database connection info.

4. **Set up PostgreSQL database:**
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

5. **Authenticate with AWS:** The app uses SST (Serverless Stack) for local development and deployment. Log in to AWS with SSO (or your AWS credentials) by running:  
   ```bash
   aws sso login --profile soleil-dev
   ``` 
   Ensure the profile `soleil-dev` is configured in your AWS CLI with the correct permissions.

6. **Run the development server:**
   ```bash
   npx sst dev
   ```
   Note: `pnpm dev` does not work for local development.
   Access the app at http://localhost:3000

> **Note:** On first run, the SST stack may create a local or cloud Postgres database (depending on config) and run initial migrations via Drizzle. Make sure to run `pnpm db push` if you need to push the latest schema to the database (this uses Drizzle migrations).

## Deployment

Deploying to AWS is done via SST:

1. **Configure AWS credentials and region**
2. **Deploy with SST:**
   ```bash
   AWS_PROFILE=soleil-dev npx sst deploy --stage dev
   ```

## Project Structure

The repository is organized to separate core concerns and make development intuitive:
- The **app code** (TanStack Start project) resides in the `src/` directory, including all React components, routes, and client/server logic.
- The **infrastructure** as code (SST) is defined in files like `sst.config.ts` and within an `infra/` directory (if applicable). SST configuration declares resources such as the database, authentication, and the deployment settings for the web app.
- **Database schema and migrations** are handled by Drizzle. You'll find schema definitions in `src/lib/server/db.ts` (and related files) and migration files in `drizzle/` or a similar directory. Running `pnpm db generate` or `pnpm db push` will use Drizzle Kit to sync schema.
- **Authentication setup** is primarily in `src/lib/server/auth.ts`, where the Better Auth configuration lives (defining providers, session settings, etc.). The auth routes (sign-in, callbacks) are integrated into the TanStack Start routing.
- **Frontend pages and components** are organized under `src/routes` (for pages/views) and `src/components` (for reusable UI components). Routing is done via TanStack Router, so there may be a centralized route definition or loader files as per TanStack Start conventions.
- **Tickets & documentation** are in the `/tickets` folder and `detailed-README.md` respectively, providing guidance on development tasks and the platform's architectural decision records.

## Tech Stack

- **TanStack Start (React framework):** Type-safe React framework with file-based routing and SSR
- **AWS Lambda via SST (Serverless Stack):** Serverless deployment with infrastructure as code
- **Drizzle ORM + PostgreSQL:** Type-safe database client with PostgreSQL
- **Authentication Provider (Better Auth):** Authentication handling with multiple providers
- **UI and Frontend Libraries:** Tailwind CSS v4 with shadcn/ui components
- **React 19 + React Compiler:** Latest React features and optimizations
- **TanStack Router + Query:** Type-safe routing and data fetching

## Documentation & Resources

- **Detailed Technical Overview:** See the [detailed-README.md](./detailed-README.md) for an in-depth explanation of Solstice's vision, architecture, and technical decisions.
- **Project Plans & Tickets:** The `/tickets/` directory contains design tickets and task breakdowns for various features (foundation, membership, teams, events). These are useful for understanding upcoming work and context for each module.

## Important Libraries and Documentation

This project uses several cutting-edge libraries that are relatively new:

1. **TanStack Start (v1.115+)**: 
   - Documentation: https://tanstack.com/start/latest/docs/framework/react/overview
   - Changes to beta: https://github.com/TanStack/router/discussions/2863 
   - https://github.com/TanStack/router/tree/main/docs/start/framework/react
2. **TanStack Router (v1.115+)**:
   - Documentation: https://tanstack.com/router/latest/docs/framework/react/overview
   - https://github.com/TanStack/router/tree/main/docs/router

3. **TanStack Form**:
   - Documentation: https://tanstack.com/form/latest/docs/overview
   - https://github.com/TanStack/form

4. **React 19**:
   - Documentation: https://react.dev/blog/2024/12/05/react-19
   - https://github.com/reactjs/react.dev

5. **React Compiler**:
   - Documentation: https://react.dev/learn/react-compiler

6. **Better Auth**:
   - Documentation: https://www.better-auth.com/docs/introduction
   - https://github.com/better-auth/better-auth/
   - https://www.better-auth.com/llms.txt

7. **Drizzle ORM**:
   - Documentation: https://orm.drizzle.team/docs/overview
   - https://github.com/drizzle-team/drizzle-orm

8. **Tailwind CSS v4**:
   - Documentation: https://tailwindcss.com/docs/installation/using-vite
   - https://github.com/tailwindlabs/tailwindcss

9. **SST (Serverless Stack)**:
   - Documentation: https://sst.dev/docs/
   - https://github.com/sst/sst

MCP servers to use:
```json
{
  "mcpServers": {
    "shadcn-ui-docs": { "url": "https://gitmcp.io/shadcn/ui" },
    "tanstack-router-and-start-docs": { "url": "https://gitmcp.io/TanStack/router" },
    "react-docs": { "url": "https://gitmcp.io/reactjs/react.dev" },
    "tailwindcss-docs": { "url": "https://gitmcp.io/tailwindlabs/tailwindcss" },
    "sst-docs": { "url": "https://gitmcp.io/sst/sst" },
    "tanstack-form": { "url": "https://github.com/TanStack/form" }
  }
}
```

