
import { plaidClient } from '@/lib/plaid';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { public_token } = await request.json();

  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const { access_token, item_id } = response.data;

    // Here you would typically save the access_token and item_id to your database,
    // associated with the currently logged-in user.
    console.log('access_token:', access_token);
    console.log('item_id:', item_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Plaid API error:', error);
    return NextResponse.json({ success: false, error: 'Plaid API error' });
  }
}
