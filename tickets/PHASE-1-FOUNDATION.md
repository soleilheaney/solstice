# Phase 1: Foundation Setup & User Authentication

This document contains implementation tickets for Phase 1 of the Quadball Canada Registration & Events Platform.

## Ticket 1: Social Authentication Provider Setup

**Description:**
Configure Better Auth to work with Google, GitHub, and Apple OAuth providers. Email/password authentication has already been implemented and is working.

**Acceptance Criteria:**
- Google OAuth provider configured and working
- GitHub OAuth provider configured and working
- Apple OAuth provider configured (replacing Discord)
- Social login buttons on the sign-in page functional
- Authentication persists across sessions
- Environment variables documented for all providers

**Technical Notes:**
- Follow Better Auth documentation for provider setup
- Update auth.ts to replace Discord with Apple provider
- Ensure OAuth callback URLs are correctly configured
- Test all social auth flows in development environment
- Maintain existing email/password authentication functionality

**Priority:** Medium
**Estimated Effort:** 1 day

## Ticket 2: Member Profile Schema Extension

**Description:**
Extend the basic user model provided by Better Auth to include additional profile fields needed for Quadball Canada members.

**Acceptance Criteria:**
- Create a Member model that relates to the user model
- Include required fields:
  - Full name (first, last)
  - Contact information (phone, address)
  - Date of birth
  - Emergency contact information
  - Gender identity (for team composition rules)
  - Player position preferences
  - Province/region
  - Team affiliation (nullable, for future linking)
- Database schema updated with new tables
- TypeScript types generated automatically via Drizzle
- Profile information persists between sessions

**Technical Notes:**
- Use Drizzle ORM's PostgreSQL schema definition (`pgTable`)
- Create a foreign key relationship to the Better Auth user table using `references`
- Use appropriate column types (text, timestamp, boolean, json) for different data
- Add constraints like `notNull()` and `unique()` where needed
- Create proper indexes for fields that will be frequently queried
- Use Drizzle Kit for generating and running migrations:
  ```
  pnpm db:generate
  pnpm db:migrate
  ```
- Implement zod validation schemas for API input validation
- Use a transaction when creating member profiles to ensure data consistency

**Priority:** High
**Estimated Effort:** 2-3 days

## Ticket 3: Admin Role Implementation

**Description:**
Implement an initial role system to designate admin users who can manage the platform.

**Acceptance Criteria:**
- Create a Roles model/table with role definitions
- Implement user-role relationship in database
- Create a server-side middleware for admin role checking
- Add helper functions to check user roles
- Implement a route guard for admin-only routes
- Add initial admin user creation capability
- Basic admin dashboard route protected by role check

**Technical Notes:**
- Use Drizzle ORM to define the roles schema:
  ```typescript
  export const role = pgTable("role", {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(),
    description: text("description"),
    permissions: json("permissions").$type<string[]>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  });

  export const userRole = pgTable("user_role", {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    roleId: text("role_id")
      .notNull()
      .references(() => role.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  });
  ```
- Create indexes on the `userId` and `roleId` fields for efficient queries
- Add server-side middleware using Better Auth session and Drizzle queries:
  ```typescript
  const isAdmin = await db.query.userRole.findFirst({
    where: (ur, { eq, and }) => 
      and(eq(ur.userId, session.user.id), eq(ur.roleId, "admin")),
  });
  ```
- Use TanStack Router's route guards for protecting admin routes
- Store role information in the user's session for efficient access
- Implement database seed function to create initial roles
- Add comprehensive error handling and logging

**Priority:** High
**Estimated Effort:** 1-2 days

## Ticket 4: Profile Management UI

**Description:**
Create a user interface for members to view and edit their profile information.

**Acceptance Criteria:**
- Profile page accessible after login
- Display all member information in a clean, organized layout
- Edit functionality for all profile fields
- Form validation on all fields
- Save changes with proper error handling
- Responsive design that works on mobile and desktop
- Loading states for async operations
- Success/error messaging

**Technical Notes:**
- Use shadcn/ui components for consistent styling
- Implement with TanStack Form for validation and submission
- Use TanStack Query for data fetching
- Ensure accessibility standards are met
- Consider UX for required vs. optional fields
- Add throttling/debouncing for save operations

**Priority:** Medium
**Estimated Effort:** 2-3 days