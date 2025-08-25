# Setup Instructions - Next.js with Clerk

## 1. Facebook Developer Console Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing one
3. Add "Facebook Login" product to your app
4. Configure OAuth settings:
   - Valid OAuth Redirect URIs: Add your Clerk redirect URI (you'll get this from Clerk dashboard)
   - Client OAuth Login: Enabled
   - Web OAuth Login: Enabled
5. Note down your **App ID** and **App Secret**

## 2. Clerk Dashboard Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Go to "User & Authentication" → "Social Connections"
4. Enable Facebook OAuth
5. Add your Facebook App ID and App Secret
6. Copy your **Publishable Key** and **Secret Key**

## 3. Environment Configuration

Create a `.env.local` file in the root directory:
```
# Clerk Configuration (already provided)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bGl2aW5nLWhhbXN0ZXItNTkuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_Y4HTjSDaaLR7JlRTEzpoPJ3aUsdsyli5iZZQSgdpdg

# Facebook App Configuration (add your own)
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
```

## 4. Installation & Running

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The application will be available at http://localhost:3000

## 5. Testing

1. Open http://localhost:3000
2. Click "Sign in" button in the header
3. Choose "Continue with Facebook"
4. Authorize the app with Facebook
5. Write a test message and click "Post to Facebook"
6. Check your Facebook feed for the post

## 6. Project Structure

```
Auther/
├── app/
│   ├── api/
│   │   └── post/
│   │       └── route.ts          # API endpoint for posting to Facebook
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with ClerkProvider
│   └── page.tsx                  # Main page with posting form
├── middleware.ts                 # Clerk middleware
├── package.json                  # Dependencies
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── .env.local                   # Environment variables
```

## Troubleshooting

- Make sure Facebook app is in "Development" mode for testing
- Ensure all redirect URIs are properly configured in both Facebook and Clerk
- Check that environment variables are set correctly
- Verify Facebook app has the required permissions (publish_actions)
- Make sure you're using the latest version of @clerk/nextjs

## Key Features

- ✅ Facebook OAuth via Clerk
- ✅ Protected API routes using Clerk's auth()
- ✅ Direct posting to Facebook Graph API
- ✅ Minimal, functional UI
- ✅ TypeScript support
- ✅ Next.js App Router
