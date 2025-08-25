# Vercel Environment Variables Setup

To fix the `MIDDLEWARE_INVOCATION_FAILED` error, you need to configure the Clerk environment variables in your Vercel project.

## Step 1: Get Your Clerk Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Go to **API Keys** in the sidebar
4. Copy your **Publishable Key** and **Secret Key**

## Step 2: Add Environment Variables to Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **Auther** project
3. Go to **Settings** tab
4. Click on **Environment Variables** in the left sidebar
5. Add the following environment variables:

### For Production:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bGl2aW5nLWhhbXN0ZXItNTkuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_Y4HTjSDaaLR7JlRTEzpoPJ3aUsdsyli5iZZQSgdpdg
```

### For Preview (optional):
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bGl2aW5nLWhhbXN0ZXItNTkuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_Y4HTjSDaaLR7JlRTEzpoPJ3aUsdsyli5iZZQSgdpdg
```

## Step 3: Redeploy

1. After adding the environment variables, go to **Deployments** tab
2. Click **Redeploy** on your latest deployment
3. Or push a new commit to trigger a new deployment

## Step 4: Verify Setup

1. Once deployed, visit your Vercel URL
2. You should see the Auther app with Clerk authentication working
3. The sign-in/sign-up buttons should appear in the header

## Troubleshooting

If you still get errors:
1. Make sure both environment variables are set correctly
2. Check that the keys match your Clerk application
3. Ensure the environment variables are set for the correct environment (Production/Preview)
4. Redeploy after making changes

## Note

The keys provided in the example are test keys. For production, you should:
1. Use your own Clerk application
2. Use production keys instead of test keys
3. Configure your Facebook OAuth settings in Clerk dashboard
