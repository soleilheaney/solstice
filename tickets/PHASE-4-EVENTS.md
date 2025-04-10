# Phase 4: Event Management & Registration

This document contains implementation tickets for Phase 4 of the Quadball Canada Registration & Events Platform.

## Ticket 1: Event and Tournament Models

**Description:**
Create the database models for events, tournaments, and related entities.

**Acceptance Criteria:**
- Create Event model with:
  - Event name, description, type (tournament, league, etc.)
  - Date range (start/end)
  - Location details
  - Registration period (open/close dates)
  - Capacity limits
  - Fee structure
  - Organizer information
  - Event status (draft, published, canceled, etc.)
  - Custom fields for event-specific data
- Create Division model for tournament divisions:
  - Division name and description
  - Team capacity
  - Requirements (gender ratio, etc.)
- Create Schedule model for tournament games:
  - Match time and location
  - Teams involved
  - Score tracking
  - Game status
- Implement API endpoints for event CRUD operations
- Add validation for all required fields

**Technical Notes:**
- Use Drizzle ORM's PostgreSQL schema definition with relations:
  ```typescript
  export const event = pgTable("event", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    eventType: text("event_type", { 
      enum: ["tournament", "league", "clinic", "meeting"] 
    }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    location: jsonb("location").$type<LocationType>(),
    registrationStartDate: timestamp("registration_start_date").notNull(),
    registrationEndDate: timestamp("registration_end_date").notNull(),
    capacity: integer("capacity"),
    fees: jsonb("fees").$type<EventFeesType>(),
    organizerId: text("organizer_id")
      .notNull()
      .references(() => user.id),
    organizationId: text("organization_id")
      .references(() => organization.id),
    status: text("status", { 
      enum: ["draft", "published", "registration_closed", "in_progress", "completed", "canceled"] 
    }).notNull().default("draft"),
    customFields: jsonb("custom_fields"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }, (table) => {
    return {
      dateIdx: index("event_date_idx").on(table.startDate, table.endDate),
      statusIdx: index("event_status_idx").on(table.status),
      organizationIdx: index("event_organization_idx").on(table.organizationId),
    }
  });

  export const division = pgTable("division", {
    id: text("id").primaryKey(),
    eventId: text("event_id")
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    teamCapacity: integer("team_capacity"),
    requirements: jsonb("requirements").$type<DivisionRequirementsType>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  });

  export const game = pgTable("game", {
    id: text("id").primaryKey(),
    eventId: text("event_id")
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),
    divisionId: text("division_id")
      .references(() => division.id),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time"),
    location: text("location"),
    team1Id: text("team1_id")
      .references(() => team.id),
    team2Id: text("team2_id")
      .references(() => team.id),
    team1Score: integer("team1_score"),
    team2Score: integer("team2_score"),
    status: text("status", { 
      enum: ["scheduled", "in_progress", "completed", "canceled", "postponed"] 
    }).notNull().default("scheduled"),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }, (table) => {
    return {
      timeIdx: index("game_time_idx").on(table.startTime),
      eventIdx: index("game_event_idx").on(table.eventId),
      divisionIdx: index("game_division_idx").on(table.divisionId),
    }
  });
  ```
- Create relationship tables for many-to-many mappings:
  ```typescript
  export const eventRegistration = pgTable("event_registration", {
    id: text("id").primaryKey(),
    eventId: text("event_id")
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),
    teamId: text("team_id")
      .references(() => team.id),
    userId: text("user_id")
      .references(() => user.id),
    divisionId: text("division_id")
      .references(() => division.id),
    status: text("status", { 
      enum: ["pending", "approved", "rejected", "waitlisted", "canceled"] 
    }).notNull().default("pending"),
    paymentStatus: text("payment_status", { 
      enum: ["unpaid", "partially_paid", "paid", "refunded"] 
    }).notNull().default("unpaid"),
    registrationData: jsonb("registration_data"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }, (table) => {
    return {
      eventTeamIdx: index("event_team_idx").on(table.eventId, table.teamId),
      eventUserIdx: index("event_user_idx").on(table.eventId, table.userId),
    }
  });
  ```
- Design flexible event type structure using JSON fields for custom attributes
- Use Drizzle's relation inferencing to create type-safe queries
- Implement database functions for recurring event creation
- Create specialized indexes for filtering and searching events
- Use prepared queries for common operations

**Priority:** High
**Estimated Effort:** 3 days

## Ticket 2: Event Creation and Management UI

**Description:**
Implement the interface for creating and managing events within the platform.

**Acceptance Criteria:**
- Event creation form with all required fields
- Support for complex event structures:
  - Multiple divisions
  - Custom registration fields
  - Fee structure configuration
  - Capacity settings
- Event management dashboard for organizers
- Ability to clone existing events
- Draft/preview functionality before publishing
- Schedule creation and management tool
- Mobile-friendly responsive design

**Technical Notes:**
- Use TanStack Form for complex form handling
- Implement flexible form schema for custom fields
- Consider UX for multi-step creation process
- Use drag-and-drop interface for schedule management
- Implement proper role checking for event creation permission
- Consider time zone handling for international events

**Priority:** High
**Estimated Effort:** 3-4 days

## Ticket 3: Team Registration Flow

**Description:**
Implement the flow for teams to register for events and tournaments.

**Acceptance Criteria:**
- Event listing page with filtering options
- Event details page with registration information
- Team registration form with:
  - Division selection
  - Roster confirmation
  - Additional registration questions
  - Fee display and payment
- Registration confirmation and receipt
- Registration management for team admins
- Waitlist functionality for full events
- Cancellation and refund flow

**Technical Notes:**
- Implement roster eligibility checks
- Create payment flow with Stripe integration
- Consider partial payments or payment plans
- Add confirmation steps for fee payment
- Implement waitlist priority management
- Consider notification system for registration status changes

**Priority:** High
**Estimated Effort:** 3 days

## Ticket 4: Individual Registration Flow

**Description:**
Create a system for individual athletes to register for events like leagues or skill clinics.

**Acceptance Criteria:**
- Individual registration form with:
  - Personal information confirmation
  - Skill level selection (if applicable)
  - Team preferences (for draft leagues)
  - Additional registration questions
  - Fee payment
- Registration confirmation and receipt
- Individual dashboard for event registrations
- Cancellation and refund process
- Ability to transfer registration (if applicable)

**Technical Notes:**
- Integrate with membership status checking
- Implement waiver requirements
- Add validation for registration eligibility
- Create payment integration with Stripe
- Consider notification system for registration updates
- Implement efficient database queries

**Priority:** Medium
**Estimated Effort:** 2-3 days

## Ticket 5: Event Check-In and Management

**Description:**
Create tools for event day management, including check-in processes and live updates.

**Acceptance Criteria:**
- Digital check-in system for teams and individuals
- QR code generation for quick check-in
- Roster verification at check-in
- Tournament bracket/schedule management
- Live score and results tracking
- Schedule change notifications
- Game/match management interface
- Results publication workflow

**Technical Notes:**
- Consider offline functionality for venues with poor connectivity
- Implement QR code generation and scanning
- Design mobile-optimized interfaces for field use
- Consider real-time updates vs. polling
- Implement efficient data synchronization
- Design for rapid data entry of scores/results

**Priority:** Medium
**Estimated Effort:** 3-4 days

## Ticket 6: Event Reporting and Analytics

**Description:**
Implement reporting tools for event organizers to track registrations, finances, and outcomes.

**Acceptance Criteria:**
- Registration analytics dashboard
- Financial reporting with:
  - Revenue breakdown
  - Payment status tracking
  - Refund monitoring
- Attendance reporting
- Team/player performance statistics
- Export functionality for all reports
- Historical comparison of events
- Custom report generation

**Technical Notes:**
- Implement efficient aggregation queries
- Consider data visualization libraries
- Design for printable report formats
- Create CSV/Excel export functionality
- Consider caching strategies for report data
- Implement proper permission controls for sensitive data

**Priority:** Low
**Estimated Effort:** 2-3 days