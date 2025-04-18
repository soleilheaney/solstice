# Team Creation & Management

**Summary:** Implement the ability for users to create and manage teams (organizations) within Solstice. This feature includes a team creation form, management dashboard, and basic team settings. Teams are a core entity in the application that will contain members and host events.

**Goals:**
- Provide a user interface for creating a new team with fields: Team Name, Description, and other basic details
- Store team information in the database associated with the creator (who becomes the admin)
- Create a team management dashboard showing team details and members
- Allow team admins to edit team information (name, description, etc.)
- Implement basic team settings (e.g., privacy settings, team image)

**Technical Scope:**
- **UI/Form:** Create a "Create Team" page accessible via the user dashboard. The form will collect necessary team information using Tailwind and shadcn/UI components.
- **Database:** Leverage Better Auth's organization model if available. If not, create a `teams` table with fields: id, name, description, created_at, updated_at, and any other relevant fields.
- **Server Action:** Implement an action that handles team creation:
  - Ensure user is logged in
  - Validate input (required fields, length limits, etc.)
  - Create a new team record in the database
  - Associate the creator as the team admin (likely in a `team_members` or `organization_members` table)
  - Redirect to the new team's dashboard page
- **Team Dashboard:** Create a team dashboard page (`/teams/{id}`) that displays:
  - Team information (name, description, etc.)
  - Team members list (showing admins distinctly)
  - Navigation to team settings and other team areas
- **Edit Functionality:** Allow team admins to edit team information via a form similar to creation
- **Permissions:** Implement permission checks to ensure only team admins can access settings/edit pages

**Relevant Code/Docs:**
- Better Auth documentation on organizations/teams (if available)
- `src/lib/server/db.ts` for database schema and queries
- `src/routes/teams/[id]/index.tsx` (team dashboard page)
- `src/routes/teams/new.tsx` (team creation page)
- Tailwind form and layout components

**Implementation Notes:**
- Consider the relationship between users and teams - users can belong to multiple teams and have different roles (admin, member) in each
- Team creation should be simple to encourage users to get started quickly - avoid requiring too many fields initially
- Think about future features when designing the schema - teams will eventually have events, resources, and other associated entities
- Include appropriate validation (server-side and client-side) for team names and other fields
- Make sure to implement proper error handling and success confirmations
- Ensure team URLs are clean and readable (e.g., /teams/teamid or potentially /teams/team-name with proper slugification)
- Consider adding a team "onboarding" checklist on the dashboard to guide new team admins through setup (optional stretch goal)