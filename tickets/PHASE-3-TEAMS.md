# Phase 3: Team Management

This document contains implementation tickets for Phase 3 of the Quadball Canada Registration & Events Platform.

## Ticket 1: Team and Organization Models

**Description:**
Create the database models for teams and organizations within the platform.

**Acceptance Criteria:**
- Create Team model with:
  - Team name, logo, contact information
  - Home location/region
  - Founding date
  - Team social media links
  - Team description
  - Team status (active/inactive)
- Create Organization model (parent entity to teams):
  - Organization name, logo, contact information
  - Description and website
  - Governance information
- Implement relationships between Team, Organization, and User models
- Create API endpoints for team and organization CRUD operations
- Add validation for all required fields

**Technical Notes:**
- Use Drizzle ORM's PostgreSQL schema definition for models:
  ```typescript
  export const organization = pgTable("organization", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    logo: text("logo"),
    email: text("email").notNull(),
    phone: text("phone"),
    website: text("website"),
    description: text("description"),
    address: jsonb("address").$type<AddressType>(),
    status: text("status", { enum: ["active", "inactive"] }).notNull().default("active"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  });

  export const team = pgTable("team", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    logo: text("logo"),
    organizationId: text("organization_id").references(() => organization.id),
    location: text("location"),
    foundedDate: date("founded_date"),
    socialLinks: jsonb("social_links").$type<SocialLinksType>(),
    description: text("description"),
    status: text("status", { enum: ["active", "inactive"] }).notNull().default("active"),
    deletedAt: timestamp("deleted_at"),  // For soft delete
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  });

  export const teamMember = pgTable("team_member", {
    id: text("id").primaryKey(),
    teamId: text("team_id").notNull().references(() => team.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["admin", "coach", "player", "manager"] }).notNull(),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
    leftAt: timestamp("left_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }, (table) => {
    return {
      teamUserIdx: uniqueIndex("team_user_idx").on(table.teamId, table.userId),
    }
  });
  ```
- Create indexes for frequently queried fields like `organizationId` and `status`
- Implement prepared queries with Drizzle for efficient data access:
  ```typescript
  export const getTeam = db.query.team.findFirst({
    where: (team, { eq }) => eq(team.id, $teamId),
    with: {
      organization: true,
      members: {
        where: (member, { isNull }) => isNull(member.leftAt),
        with: {
          user: true,
        }
      }
    }
  }).prepare("get_team");
  ```
- Implement soft delete by updating the `deletedAt` field instead of removing records
- Design schema for future multi-tenancy by ensuring proper organization scoping
- Use Drizzle relations for type-safe relationship queries

**Priority:** High
**Estimated Effort:** 2 days

## Ticket 2: Team Creation Flow

**Description:**
Implement the UI and workflow for creating new teams within the platform.

**Acceptance Criteria:**
- Team creation form with all required fields
- Team logo upload and management
- Validation of team information
- Organization selection/association
- Automatic assignment of creator as team admin
- Team creation confirmation
- Ability to save team as draft before publishing
- Mobile-friendly responsive design

**Technical Notes:**
- Use TanStack Form for form handling
- Implement image upload and processing
- Consider UX for multi-step creation process
- Add proper validation with helpful error messages
- Consider team naming conflicts/uniqueness
- Implement proper role checking for team creation permission

**Priority:** High
**Estimated Effort:** 2 days

## Ticket 3: Roster Management

**Description:**
Create functionality for managing team rosters, including adding/removing players and assigning roles.

**Acceptance Criteria:**
- Interface for viewing current team roster
- Ability to add players to roster by invitation
- Remove players from roster
- Assign team roles (captain, coach, manager)
- Display player membership status within roster
- Filter/search functionality for large rosters
- Roster history tracking
- Roster size limits and validation
- Export roster functionality

**Technical Notes:**
- Implement proper permission checks for roster management
- Consider gender ratio rules for Quadball
- Use optimistic UI updates for better UX
- Add confirmation steps for removing players
- Consider notification system for roster changes
- Implement efficient batch operations for multiple player actions

**Priority:** High
**Estimated Effort:** 2-3 days

## Ticket 4: Team Invitation System

**Description:**
Create a system for inviting players to join teams and managing those invitations.

**Acceptance Criteria:**
- Generate team invitation links/codes
- Email invitation functionality
- Invitation acceptance/rejection flow
- Invitation expiration handling
- Interface for managing pending invitations
- Limit on number of outstanding invitations
- Prevent invitations to players already on teams (if applicable)
- Notification system for invitation status changes

**Technical Notes:**
- Generate secure, unique invitation codes
- Implement proper expiration handling
- Consider rate limiting for invitation generation
- Add email templates for invitations
- Track invitation status in database
- Consider UX for players with multiple invitations

**Priority:** Medium
**Estimated Effort:** 2 days

## Ticket 5: Team Profile and Management UI

**Description:**
Implement the team profile page and management interface for team administrators.

**Acceptance Criteria:**
- Public team profile with:
  - Team information and description
  - Roster (public view)
  - Team achievements/history
  - Contact information
- Admin team management interface:
  - Edit team information
  - Manage roster
  - Team settings
  - View team statistics
- Responsive design for all screen sizes
- Different views based on user role/permissions

**Technical Notes:**
- Use shadcn/ui components for consistent UI
- Implement proper role checking for management features
- Use TanStack Query for efficient data fetching
- Consider caching strategies for public team profiles
- Implement optimistic UI updates for better UX
- Add proper loading states for async operations

**Priority:** Medium
**Estimated Effort:** 2-3 days

## Ticket 6: Team Communication Tools

**Description:**
Implement basic communication tools for team members and administrators.

**Acceptance Criteria:**
- Team announcement functionality
- Email notification to team members
- Team message board/feed
- Comment functionality on announcements
- Ability to tag/mention specific team members
- Team calendar for events and practices
- Permission-based posting abilities
- Mobile notifications (if applicable)

**Technical Notes:**
- Consider real-time vs. polling updates
- Implement email templating system
- Use proper sanitization for user-generated content
- Consider notification preferences per user
- Implement efficient database queries for activity feeds
- Consider privacy implications of team communications

**Priority:** Low
**Estimated Effort:** 3-4 days