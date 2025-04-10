# Phase 2: Member Profiles & Membership Management

This document contains implementation tickets for Phase 2 of the Quadball Canada Registration & Events Platform.

## Ticket 1: Membership Model & Types

**Description:**
Create the membership models that define different membership types, their durations, and benefits.

**Acceptance Criteria:**
- Create Membership and MembershipTier models in the database
- Define membership types (Adult, Youth, Coach, etc.)
- Configure pricing for each membership type
- Include fields for:
  - Duration/validity period
  - Pricing
  - Description of benefits
  - Membership requirements (age range, etc.)
  - Visibility status (active/inactive)
- Create admin interface to manage membership types
- Implement API endpoints for fetching membership types

**Technical Notes:**
- Use Drizzle ORM for database schema
- Consider seasonal vs. annual membership structures
- Include versioning to handle price/benefit changes over time
- Use proper date handling for expiration calculations
- Consider tax implications for pricing

**Priority:** High
**Estimated Effort:** 1-2 days

## Ticket 2: Stripe Integration for Payments

**Description:**
Implement Stripe integration for handling membership payments securely.

**Acceptance Criteria:**
- Integrate Stripe SDK for payment processing
- Create secure payment flow for memberships
- Implement webhook handling for payment events
- Store payment records securely in database
- Handle successful payment confirmations
- Implement error handling for failed payments
- Create receipts/invoices for completed payments
- Support one-time and recurring payment options
- Test payment flows in Stripe test environment

**Technical Notes:**
- Use Stripe Elements for secure payment form
- Implement proper webhook signature verification
- Store only necessary payment information locally
- Consider compliance requirements (PCI-DSS)
- Implement idempotency to prevent duplicate charges
- Add logging for payment attempts and outcomes
- Use Stripe Customer objects for recurring payments

**Priority:** High
**Estimated Effort:** 2-3 days

## Ticket 3: Membership Purchase Flow

**Description:**
Create the user interface and flow for members to purchase or renew memberships.

**Acceptance Criteria:**
- Membership selection interface showing available options
- Clear display of pricing and benefits
- Streamlined checkout process
- Support for discount codes/coupons
- Automatic detection of renewal eligibility
- Mobile-friendly payment flow
- Order summary before payment
- Confirmation page after successful payment
- Email receipt sent to user
- Update user record with membership status

**Technical Notes:**
- Use TanStack Form for form handling
- Implement multi-step checkout process
- Use optimistic UI updates for better UX
- Consider accessibility throughout the flow
- Add analytics tracking for conversion monitoring
- Implement proper form validation

**Priority:** High
**Estimated Effort:** 2-3 days

## Ticket 4: Waiver & Consent Management

**Description:**
Implement digital waiver signing and consent management for legal requirements.

**Acceptance Criteria:**
- Create Waiver model in database
- Support multiple waiver versions/types
- Digital signature capture functionality
- Timestamp and IP address recording for legal validity
- PDF generation of signed waivers
- Storage of consent records in database
- Waiver requirement checks during membership purchase
- Admin interface for managing waiver templates
- View/download functionality for signed waivers

**Technical Notes:**
- Consider legal requirements for digital signatures
- Use PDF generation library for documents
- Store waivers securely with access controls
- Implement version control for waiver documents
- Consider accessibility requirements for waiver UI
- Add email confirmation for waiver acceptance

**Priority:** Medium
**Estimated Effort:** 2-3 days

## Ticket 5: Membership Status Dashboard

**Description:**
Create a dashboard for users to view their membership status, history, and manage renewals.

**Acceptance Criteria:**
- Visual indicator of current membership status
- Display membership expiration date
- Show membership benefits
- List of past membership purchases
- Receipt/invoice download functionality
- Renewal reminders and functionality
- Payment method management
- Transaction history view
- Mobile-friendly responsive design

**Technical Notes:**
- Use TanStack Query for data fetching
- Implement caching for performance
- Use shadcn/ui components for UI elements
- Add notification system for expiration reminders
- Consider UX for encouraging renewals
- Implement proper loading states

**Priority:** Medium
**Estimated Effort:** 2 days

## Ticket 6: Admin Membership Management

**Description:**
Create admin interfaces for managing memberships, viewing statistics, and handling special cases.

**Acceptance Criteria:**
- Admin dashboard for membership overview
- Search and filtering of members by status
- Ability to manually adjust membership status
- Reporting tools for membership statistics
- Export functionality for member data
- Handling of refunds or special cases
- Audit log of membership changes
- Revenue reports by membership type

**Technical Notes:**
- Implement proper role checking for admin functions
- Use data tables with sorting/filtering capabilities
- Consider performance for large datasets
- Implement export to CSV/Excel functionality
- Add charts/visualizations for statistics
- Consider GDPR/privacy implications for exports

**Priority:** Medium
**Estimated Effort:** 2-3 days