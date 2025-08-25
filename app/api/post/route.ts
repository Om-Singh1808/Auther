import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';

export async function POST(request: NextRequest) {
  console.log('🔧 [BACKEND] POST request received to /api/post');
  
  try {
    // Get the authenticated user
    console.log('🔐 [BACKEND] Authenticating user...');
    const { userId } = await auth();
    console.log('👤 [BACKEND] User ID:', userId);
    
    if (!userId) {
      console.log('❌ [BACKEND] No user ID found - unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    console.log('📥 [BACKEND] Parsing request body...');
    const body = await request.json();
    console.log('📄 [BACKEND] Request body:', body);
    
    const { message } = body;
    console.log('💬 [BACKEND] Message extracted:', message);
    
    if (!message || typeof message !== 'string') {
      console.log('❌ [BACKEND] Invalid message format');
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get user's OAuth accounts
    console.log('🔍 [BACKEND] Fetching user from Clerk...');
    const user = await clerkClient.users.getUser(userId);
    console.log('👤 [BACKEND] User object:', {
      id: user.id,
      emailAddresses: user.emailAddresses?.map(e => e.emailAddress),
      externalAccounts: user.externalAccounts?.map(e => ({ provider: e.provider, id: e.id }))
    });
    
    const oauthAccounts = user.externalAccounts.filter(
      account => account.provider === 'oauth_facebook'
    );
    console.log('🔗 [BACKEND] Facebook OAuth accounts found:', oauthAccounts.length);
    console.log('🔗 [BACKEND] OAuth accounts details:', oauthAccounts.map(acc => ({
      provider: acc.provider,
      id: acc.id
    })));

    if (oauthAccounts.length === 0) {
      console.log('❌ [BACKEND] No Facebook account connected');
      return NextResponse.json(
        { error: 'No Facebook account connected. Please sign in with Facebook.' }, 
        { status: 400 }
      );
    }

    // For now, we'll return an error since getting OAuth tokens requires additional setup
    // In a production environment, you would need to use Clerk's OAuth token management
    console.log('❌ [BACKEND] OAuth token access not implemented in this version');
    return NextResponse.json(
      { error: 'Facebook posting is not yet implemented. Please use the Python backend for posting functionality.' }, 
      { status: 501 }
    );



  } catch (error) {
    console.error('💥 [BACKEND] Error posting to Facebook:', error);
    console.error('💥 [BACKEND] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

