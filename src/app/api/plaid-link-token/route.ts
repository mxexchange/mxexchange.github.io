
import { plaidClient } from '@/lib/plaid';
import { NextRequest, NextResponse } from 'next/server';
import { Products, CountryCode } from 'plaid';

export async function POST(request: NextRequest) {
  const configs = {
    user: {
      // This should be a unique identifier for the user
      client_user_id: 'user-id',
    },
    client_name: 'Plaid Quickstart',
    products: [Products.Auth],
    country_codes: [CountryCode.Us],
    language: 'en',
  };

  try {
    const createTokenResponse = await plaidClient.linkTokenCreate(configs);
    return NextResponse.json(createTokenResponse.data);
  } catch (error) {
    console.error('Plaid API error:', error);
    return NextResponse.json({ success: false, error: 'Plaid API error' });
  }
}
