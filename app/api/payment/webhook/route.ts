import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    const signature = request.headers.get('x-paystack-signature');

    if (hash !== signature) {
      return new Response('Invalid signature', { status: 400 });
    }

    const event = JSON.parse(body);

    await connectDB();

    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      const orderNumber = reference.split('-')[0];

      const order = await Order.findOne({ orderNumber });

      if (order) {
        order.paymentInfo.status = 'completed';
        order.paymentInfo.paystackReference = reference;
        order.status = 'processing';
        await order.save();
      }
    }

    return new Response('Webhook received', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook failed', { status: 500 });
  }
}