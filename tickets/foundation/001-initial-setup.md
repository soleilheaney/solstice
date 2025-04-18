# Initial Project Setup

**Summary:** Set up the base project structure and tools for Solstice. This includes configuring the React framework (TanStack Start), establishing the monorepo or folder structure, and integrating essential libraries (Tailwind CSS, SST for infrastructure, etc.). The outcome is a running app skeleton with a home page and no major features, but all configurations in place.

**Goals:**
- Scaffold a new TanStack Start application and verify it runs in development mode.
- Configure Tailwind CSS v4 and ensure it builds styles correctly.
- Initialize the SST project with a basic config that deploys the app (hello world page) to AWS.
- Set up the code repository structure (src folders, etc.) and add all stack dependencies (React, Router, Query, Better Auth, Drizzle, etc.) as needed.

**Technical Scope:**
- Create a new TanStack Start app (perhaps using a starter template if available) in the repository. Ensure it uses **React 18** and TypeScript.
- Install and configure **Tailwind CSS**: include a `tailwind.config.js` with Solstice brand colors (if decided), and verify PostCSS builds Tailwind in development and production.
- Set up **Serverless Stack (SST)**: Include `sst.config.ts` defining at least one stack with `new sst.StaticSite` or `new sst.aws.TanStackStart` (if using SST's TanStackStart construct) ([TanStackStart | SST](https://sst.dev/docs/component/aws/tan-stack-start#:~:text=The%20,TanStack%20Start%20app%20to%20AWS)). This should point to our frontend build. Verify that `npx sst dev` successfully serves the app locally.
- Integrate **Better Auth** and **Drizzle ORM** minimally: e.g., add `better-auth` and `drizzle-orm` packages, and create placeholders for config (`src/lib/server/auth.ts` and `src/lib/server/db.ts`). The actual config will be done in a later ticket, but ensure the app can compile with these in place.
- Version control: ensure a `.gitignore` is in place (Node modules, environment files, etc.), and document any setup steps in the README.

**Relevant Code/Docs:**
- TanStack Start documentation for creating a new app ([TanStack Start: A New Framework Revolutionizing React Development | by Rahul Bhooteshwar | Learn With Rahul | Medium](https://medium.com/learnwithrahul/tanstack-start-a-new-framework-revolutionizing-react-development-4143de93fc7e#:~:text=What%20is%20TanStack%20Start%3F)) (for SSR setup).
- SST docs on using the TanStackStart construct ([TanStackStart | SST](https://sst.dev/docs/component/aws/tan-stack-start#:~:text=The%20,TanStack%20Start%20app%20to%20AWS)).
- Tailwind CSS setup guide (see `tailwind.config.js` in the repo).
- Initial commit in source control for reference (contains the scaffolded code).

**Implementation Notes:**
- After this setup, the app should display a simple homepage (even just "Solstice app is running"). This will confirm that SSR, routing, and styling are wired up.
- Pay attention to ESLint and Prettier configs. Use recommended configs for React/TypeScript and Tailwind (so we maintain code quality from the start).
- This ticket lays the groundwork; **no actual auth or data features** are implemented yet, but the libraries are in place. Test deployment to a dev AWS environment to ensure CI/CD will work.
- Future tickets (auth integration, database setup) will build on this, so keep the configuration as default as possible to ease integration.