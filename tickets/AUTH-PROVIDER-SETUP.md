# Authentication Provider Setup

## Description
The application currently has partial authentication configuration with Google, GitHub, and Discord providers, but they're not functioning. This ticket covers configuring Google, GitHub, and Apple authentication providers (replacing Discord), as well as enabling username/password authentication per Better Auth documentation.

## Acceptance Criteria
- Users can authenticate using Google OAuth
- Users can authenticate using GitHub OAuth 
- Users can authenticate using Apple OAuth (replacing Discord)
- Users can register and authenticate with email/password
- Authentication persists correctly across sessions
- Sign-in buttons on the `/signin` page function properly
- Environment variables are properly set up
- Documentation is updated with required env variables

## Technical Tasks

### 1. Set Up Environment Variables
- Create `.env` file based on `.env.example`
- Ensure `VITE_BASE_URL` is correctly set for different environments
- Add and document all required auth provider secrets

### 2. Configure OAuth Providers

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or use existing project
3. Navigate to "APIs & Services" > "Credentials"
4. Create OAuth client ID for Web application
5. Add authorized JavaScript origins and redirect URIs
   - Add `http://localhost:3000` for development
   - Add production URL when ready
6. Set redirect URI to match the callback URL pattern
7. Add credentials to environment variables:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

#### GitHub OAuth Setup
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Set Homepage URL to your app URL
4. Set Authorization callback URL to match the callback pattern
5. Generate a client secret
6. Add credentials to environment variables:
   ```
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```

#### Apple OAuth Setup (Replacing Discord)
1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Register a new App ID with "Sign In with Apple" capability
3. Create a Services ID for web authentication
4. Configure domains and redirect URLs
5. Generate and download private key
6. Add credentials to environment variables:
   ```
   APPLE_CLIENT_ID=your_client_id
   APPLE_CLIENT_SECRET=your_client_secret
   ```
7. Update `auth.ts` to replace Discord with Apple:
   ```typescript
   // Replace the Discord configuration with:
   apple: {
     clientId: process.env.APPLE_CLIENT_ID!,
     clientSecret: process.env.APPLE_CLIENT_SECRET!,
   },
   ```

### 3. Enable Email/Password Authentication
1. Uncomment the `emailAndPassword` section in `auth.ts`:
   ```typescript
   emailAndPassword: {
     enabled: true,
     // Optional settings based on requirements:
     // verifyEmail: true,
     // passwordResetExpiry: 24 * 60 * 60, // 24 hours
   },
   ```
2. Create sign-up form UI component
3. Implement sign-in form UI component
4. Connect forms to auth client functions

### 4. Update Sign-in UI Component
1. Update the `SignInButton` component in `signin.tsx` to include Apple
2. Add email/password sign-in form
3. Add "Register" option for new accounts
4. Improve error handling and messaging

### 5. Testing and Verification
1. Test sign-in flows with each provider in development
2. Verify session persistence across page loads
3. Test sign-out functionality
4. Test invalid credentials scenarios
5. Verify callback URLs are working correctly

## Technical Notes
- Better Auth docs: https://www.better-auth.com/docs/
- The social providers need to be registered using the exact callback URL format expected by Better Auth
- For each provider, ensure scopes are configured properly to get necessary user information
- When testing in development, use `localhost` URLs for callbacks
- The `callbackURL` parameter in client-side code should match the redirect URI configured in provider dashboards
- Consider implementing proper loading states and error handling for auth flows

## Priority
High

## Estimated Effort
1-2 days