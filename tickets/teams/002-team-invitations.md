# Team Invitations & Onboarding

**Summary:** Enable team owners or admins to invite new members to their team. This feature will allow an admin to send an invitation (via email or link) to someone to join their organization on Solstice. Upon accepting the invite, the user is added to the team. Covers both inviting existing users (by email, where they get an invite if they don't have an account yet) and handling the acceptance flow.

**Goals:**
- Provide a UI for team admins to invite members (enter an email address or shareable link).
- Generate a unique invitation token or link tied to the team and (optionally) a specific email.
- Send an invitation email to the invitee with the link (or display the link for copy, if emailing is not in scope yet).
- When an invite link is clicked, guide the user through account creation (if new) or login (if existing), then automatically join them to the team.
- Ensure that invites can't be reused (one-time use or expire after acceptance) and can be revoked by an admin.

**Technical Scope:**
- **Database:** Use Better Auth's organization invitation system if available. Better Auth's plugin might handle generating invite codes and storing them. If not using that, create an `invitations` table with fields: team_id, email (optional), token, expires_at, and perhaps role (so admins can invite someone as a member or admin).
- **Invite Creation UI:** On the team management page (e.g., `/teams/{id}/settings`), add a form or button for "Invite member". Admin enters an email address and clicks invite. The frontend calls a server action to create an invite.
- **Invite Generation:** The server action creates a new invite entry (via Drizzle) and possibly triggers an email. For emailing, integrate a simple email service – possibly using AWS SES via SST. If email is complex to setup now, we can log the invite link to console or store it for copying.
- **Accept Invitation Flow:** Create a route like `/invite/{token}`. This route's loader will verify the token (find corresponding invite in DB). If valid, it will:
  - If the user is not logged in: redirect them to sign up or login, but preserve the invite token (e.g., as query param or in session storage) so after auth, we know to process the invite.
  - If the user is logged in (or after they log in): add the user to the team. This likely uses Better Auth's organization join method or we insert into `organization_members` table via Drizzle.
  - Mark the invite as used (so it can't be reused).
  - Redirect the user to the team's page with a welcome message.
- **Permissions:** Only team admins should be able to generate invites. Add a check in the invite-creation action for the user's role.
- **Email Template:** Draft a simple email text: "You've been invited to join [Team Name] on Solstice. Click here to accept: <invite link>". Use a mailer utility to send it. For now, this might be a console log or using a dev SMTP service if configured.

**Relevant Code/Docs:**
- Better Auth documentation on the Organization plugin and invitations (if provided in docs) ([Better Auth](https://www.better-auth.com/#:~:text=Multi%20Tenant)).
- SST docs for sending emails (could use AWS SES: might need to verify an email identity).
- `src/routes/teams/[id]/settings.tsx` (hypothetical file for team settings page where invite UI lives).
- Database schema for `organization_members` and related tables to understand how to add a member.

**Implementation Notes:**
- Security: The invite token should be sufficiently random (e.g., use `crypto.randomBytes` to generate, or a UUID). It's essentially a password to join the team, so it must be unguessable.
- Expiration: Consider setting invites to expire after, say, 7 days. This can be implemented by checking `expires_at` in the invite and cleaning up expired invites periodically (perhaps a cron job or simply whenever someone tries to use it).
- If a user tries to accept an invite to a team they are already a member of (could happen if an existing member clicks an invite link), handle gracefully (perhaps just inform them they are already in the team).
- Email deliverability: In development, instead of actual email, we might use a service like Ethereal or just print the link for testing. In production, we'll switch to an SES or third-party email service integration.
- This feature will greatly improve the onboarding of teams, as currently adding members might be manual. It relies on foundation auth work (since invites tie into accounts), so ensure that part is solid.
- After completion, update documentation (perhaps the detailed README or a help guide) on how team invitations work for reference.