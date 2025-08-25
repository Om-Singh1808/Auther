import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';

export async function GET(request: NextRequest) {
  console.log('🔍 [DEBUG] Debug endpoint called');
  
  try {
    // Get the authenticated user
    console.log('🔐 [DEBUG] Authenticating user...');
    const { userId } = await auth();
    console.log('👤 [DEBUG] User ID:', userId);
    
    if (!userId) {
      console.log('❌ [DEBUG] No user ID found - unauthorized');
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'User not authenticated'
      }, { status: 401 });
    }

    // Get user's details
    console.log('🔍 [DEBUG] Fetching user from Clerk...');
    const user = await clerkClient.users.getUser(userId);
    
    // Get OAuth accounts
    const oauthAccounts = user.externalAccounts.filter(
      account => account.provider === 'oauth_facebook'
    );
    
    console.log('🔗 [DEBUG] Facebook OAuth accounts found:', oauthAccounts.length);
    
    const debugInfo = {
      userId: userId,
      userEmail: user.emailAddresses?.[0]?.emailAddress || 'No email',
      facebookConnected: oauthAccounts.length > 0,
      facebookAccounts: oauthAccounts.map(acc => ({
        id: acc.id,
        provider: acc.provider,
        verified: acc.verification?.status === 'verified'
      })),
      allExternalAccounts: user.externalAccounts.map(acc => ({
        provider: acc.provider,
        id: acc.id,
        verified: acc.verification?.status === 'verified'
      })),
      timestamp: new Date().toISOString()
    };
    
    console.log('📊 [DEBUG] Debug info:', debugInfo);
    
    return NextResponse.json({
      success: true,
      debug: debugInfo
    });

  } catch (error) {
    console.error('💥 [DEBUG] Error in debug endpoint:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
