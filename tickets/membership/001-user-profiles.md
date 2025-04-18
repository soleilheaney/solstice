# User Profiles Page

**Summary:** Implement a user profile page where authenticated users can view and update their personal information. This includes displaying the user's name, email, and other profile details, as well as allowing them to edit certain fields (e.g., display name, avatar, bio). This page forms the basis of the "Membership" experience by giving users control over their account info.

**Goals:**
- Create a secure profile page accessible only to logged-in users.
- Display user information fetched from the database (using Better Auth's user model extended with profile fields if needed).
- Allow the user to update profile fields (e.g., change their display name or add a bio) and save those changes.
- Ensure profile updates are validated and saved to the database via Drizzle.
- (Stretch) Integrate image upload for profile avatar (could be deferred if storage not yet set up).

**Technical Scope:**
- **Frontend:** Add a route for `/profile` in TanStack Router that renders a Profile component. Use SSR to fetch the current user's data (Better Auth should provide user ID in session). The loader might query the `users` table for the user's record (or Better Auth might supply user data in session by default).
- Design the profile form UI using Tailwind and any relevant shadcn/UI components (e.g., use a form layout, input fields, and a save button).
- **Backend:** Implement an action or API route that handles profile updates. This will take the form data (e.g., new display name), validate it (ensure not empty, proper length), then use Drizzle to update the `users` table for that user.
- Use Better Auth's facilities if available: e.g., Better Auth might have a method to update user data that ensures consistency with its schema. If not, directly update via Drizzle.
- If adding an avatar upload: integrate an S3 bucket (SST can create one) and allow the user to upload an image. This likely requires a separate ticket due to complexity (file storage and presigned URLs).
- Testing: Ensure that an unauthorized user (not logged in) who tries to access `/profile` is redirected to login. Use an auth guard or check in the loader.

**Relevant Code/Docs:**
- `src/routes/profile.tsx` (Profile page component and loader/action).
- Better Auth documentation on managing user data (if any, e.g., how to extend the user model or update it).
- `src/lib/server/auth.ts` and `src/lib/server/db.ts` – to see what fields are available on the user and how to query them.
- Tailwind form styling guide (for consistent design of input fields).

**Implementation Notes:**
- Make sure to only expose editing of fields that we intend to allow users to change. For example, email might be better left non-editable (or if editable, it triggers a re-verification flow which is complex). Initially, focus on display name and perhaps a bio/description.
- Consider concurrency: if the user is on the profile page and their session expires, handle that gracefully (maybe the save action will fail with unauthorized – ensure it redirects to login).
- Use form libraries or controlled components for easier state handling. Since this is a simple form, a straightforward approach is fine.
- We should also display a confirmation or success message after saving (a small toast or message on the page) to inform the user that changes are saved.
- This page is a stepping stone for other membership features, such as account deletion or password reset (if we have passwords). Those could be separate tickets, but keep in mind where in the UI they might live (potentially also on a profile/settings page).