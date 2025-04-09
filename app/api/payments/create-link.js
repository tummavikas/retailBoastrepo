import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { dbConnect } from '@/lib/dbConnect';
import Merchant from '@/models/Merchant';
import PaymetTransaction from '@/models/paymentTransactions';
import { z } from 'zod';

const schema = z.object({
  merchantAdminId: z.string().length(24),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  const validation = schema.safeParse(req.body);
  if (!validation.success) return res.status(400).json({ message: 'Invalid input' });

  const { merchantAdminId } = validation.data;
  const amount = 100; // fixed amount

  await dbConnect();
  const merchant = await Merchant.findOne({ adminId: merchantAdminId });
  if (!merchant) return res.status(404).json({ message: 'Merchant not found' });

  const upiLink = `upi://pay?pa=${merchant.upiId}&pn=${encodeURIComponent(
    merchant.name || 'Merchant'
  )}&am=${amount}&cu=INR`;

  const txn = await PaymetTransaction.create({
    userId: session.user.email,
    merchantAdminId,
    upiId: merchant.upiId,
    amount,
    status: 'PENDING',
  });

  return res.status(200).json({ upiLink, transactionId: txn._id });
}