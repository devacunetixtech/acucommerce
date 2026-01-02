import axios from 'axios';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

export const initializePayment = async (
  email: string,
  amount: number,
  callbackUrl: string,
  reference?: string,
  metadata?: Record<string, any>
) => {
  try {
    const body: any = {
      email,
      // Ensure amount is an integer (kobo)
      amount: Math.ceil(amount * 100),
      callback_url: callbackUrl,
    };

    if (reference) body.reference = reference;
    if (metadata) body.metadata = metadata;

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      body,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Paystack initialization failed');
  }
};

export const verifyPayment = async (reference: string) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
    }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Paystack verification failed');
  }
};
