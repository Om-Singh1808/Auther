import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { signed_request } = body;

    // Facebook sends a signed_request that we need to verify
    // For now, we'll return a basic response
    // In production, you'd verify the signed_request

    return NextResponse.json({
      url: 'http://localhost:3000/privacy',
      confirmation_code: '123456789'
    });

  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  // Return data deletion instructions
  return NextResponse.json({
    data_deletion_url: 'http://localhost:3000/privacy',
    access_token: 'sample_access_token'
  });
}
