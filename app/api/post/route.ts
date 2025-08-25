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
      id: acc.id,
      hasToken: !!acc.token
    })));

    if (oauthAccounts.length === 0) {
      console.log('❌ [BACKEND] No Facebook account connected');
      return NextResponse.json(
        { error: 'No Facebook account connected. Please sign in with Facebook.' }, 
        { status: 400 }
      );
    }

    // Get the Facebook access token
    const facebookAccount = oauthAccounts[0];
    console.log('🎫 [BACKEND] Facebook account details:', {
      id: facebookAccount.id,
      provider: facebookAccount.provider,
      hasToken: !!facebookAccount.token
    });
    
    const accessToken = facebookAccount.token;
    console.log('🔑 [BACKEND] Access token available:', !!accessToken);

    if (!accessToken) {
      console.log('❌ [BACKEND] Facebook access token not available');
      return NextResponse.json(
        { error: 'Facebook access token not available' }, 
        { status: 400 }
      );
    }

    // Post to Facebook using Graph API
    console.log('📤 [BACKEND] Making request to Facebook Graph API...');
    const facebookUrl = 'https://graph.facebook.com/v18.0/me/feed';
    console.log('🌐 [BACKEND] Facebook API URL:', facebookUrl);
    
    const facebookResponse = await fetch(facebookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        message: message,
        access_token: accessToken,
      }),
    });

    console.log('📥 [BACKEND] Facebook API response received');
    console.log('📊 [BACKEND] Facebook response status:', facebookResponse.status);
    console.log('📊 [BACKEND] Facebook response ok:', facebookResponse.ok);

    const facebookData = await facebookResponse.json();
    console.log('📄 [BACKEND] Facebook API response data:', facebookData);

    if (!facebookResponse.ok) {
      console.error('❌ [BACKEND] Facebook API error:', facebookData);
      return NextResponse.json(
        { error: 'Failed to post to Facebook. Please check your permissions.' }, 
        { status: 400 }
      );
    }

    console.log('✅ [BACKEND] Facebook post successful!');
    console.log('🆔 [BACKEND] Post ID:', facebookData.id);
    
    return NextResponse.json({
      success: true,
      message: 'Post published successfully!',
      postId: facebookData.id,
    });

  } catch (error) {
    console.error('💥 [BACKEND] Error posting to Facebook:', error);
    console.error('💥 [BACKEND] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

