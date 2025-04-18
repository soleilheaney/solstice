# Event Creation & Management

**Summary:** Implement the ability for team members (typically admins or event organizers) to create new events. This feature includes an event creation form, storing event details in the database, and displaying those events on the relevant pages (e.g., team events list, calendar view in the future). It is a critical part of the Events module of Solstice.

**Goals:**
- Provide a form/UI for creating an event with fields: Title, Description, Date & Time (start/end), Location, and any relevant options (e.g., is it online or in-person, capacity limits).
- Validate input (e.g., title required, start time before end time).
- Save the event to the database associated with the correct team (and organizer user).
- After creation, redirect the user to the event detail page or events list with the new event visible.
- Only authorized users can create events (e.g., team admins or specific roles).

**Technical Scope:**
- **UI/Form:** Create an "Add Event" page or modal. This could be accessible via a button on the team's Events page ("/teams/{id}/events"). The form will collect all necessary info. Use date-time pickers for convenience (possibly a simple HTML5 datetime for now, or integrate a library for better UI).
- **State Management:** Use React state or a form library to handle form inputs. Possibly leverage TanStack Start's forms handling (maybe via actions).
- **Server Action:** On form submission, an action will be called (TanStack Start allows form posts to server actions). Implement the action to parse and validate the data:
  - Ensure user is logged in and is a team member with rights to create an event.
  - Validate fields (title length, date formats, etc.; use a schema validator like Zod).
  - Insert a new row in the `events` table via Drizzle. Fields: team_id, creator_user_id, title, description, start_time, end_time, location, etc.
  - Possibly also create related entries, e.g., an initial RSVP record for the creator if we auto-mark them as attending (or that can be separate).
- **Redirect:** After successful creation, redirect to the event detail page (`/teams/{id}/events/{eventId}`) or back to the list with a success message. Use TanStack Router's navigation in the action result.
- **Event Model:** Ensure the `events` table is defined in Drizzle schema. Add any missing fields via a migration if needed. Perhaps include `created_at` timestamp by default.
- **Permissions:** In the loader for event creation page or in the action, verify permissions. Non-admins should possibly be blocked (depending on policy, maybe any member can suggest events but only admins can finalize – define this clearly).
- **UI Feedback:** If the form validation fails or DB insertion fails, show errors to the user (e.g., field errors or a general error message).

**Relevant Code/Docs:**
- `src/routes/teams/[id]/events/new.tsx` or similar (the page component and form handling).
- Drizzle model definition for events (likely in `src/lib/server/db.ts`).
- TanStack Router/Start docs on form submissions or actions for reference on how to properly do server mutations.
- Possibly refer to how Next.js or Remix handle forms as inspiration, since TanStack Start may have similarities.

**Implementation Notes:**
- Use ISO strings or a consistent format for storing date/time in the DB (likely as UTC). Drizzle and the PostgreSQL column (timestamp with time zone) can handle this.
- Time zones: For now, assume input times are in user's local and convert to UTC. In the future, we might allow specifying a timezone or location-based time handling.
- If location is a free text field (for virtual vs physical addresses), for now just store a string (could be "Zoom link: ...", or "123 Main St, City"). Future enhancement: break it into structured fields or coordinates.
- Once an event is created, subsequent tickets will cover listing them and letting users RSVP. For now, focus on creation and ensuring the data is correctly stored.
- Consider adding a test event via the UI and then checking the database (with a DB viewer or console log) to ensure data integrity. This will help catch any migration/schema issues early.
- This feature adds significant value as it's the cornerstone of the platform's purpose. Make sure to get feedback on the form UX from team members (maybe in a demo) and refine as needed.