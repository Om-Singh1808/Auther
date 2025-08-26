import { NextRequest, NextResponse } from 'next/server';

// Get the base URL from environment or use a fallback
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  return 'http://localhost:3000';
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { signed_request } = body;

    // Facebook sends a signed_request that we need to verify
    // For now, we'll return a basic response
    // In production, you'd verify the signed_request

    const baseUrl = getBaseUrl();
    const privacyUrl = `${baseUrl}/privacy-policy`;

    return NextResponse.json({
      url: privacyUrl,
      confirmation_code: '123456789'
    });

  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  // Return data deletion instructions
  const baseUrl = getBaseUrl();
  const privacyUrl = `${baseUrl}/privacy-policy`;
  
  return NextResponse.json({
    data_deletion_url: privacyUrl,
    access_token: 'sample_access_token'
  });
}
