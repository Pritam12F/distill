import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe';
import { errorDecoder } from '@/utils/error-decoder';


export async function POST() {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: '{{PRICE_ID}}',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: '{{INTEGRATION_ID}}',
    });
    return NextResponse.redirect(session.url!, 303)
  } catch (err) {
    const errDecoded = errorDecoder(err);    
    
    return NextResponse.json(
      { error: errDecoded },
      { status: 500 }
    )
  }
}