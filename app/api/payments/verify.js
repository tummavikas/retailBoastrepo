import { dbConnect } from '@/lib/dbConnect';
import PaymentTransaction from '@/models/paymentTransactions';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { z } from 'zod';

const schema = z.object({
  transactionId: z.string().length(24),
  txnId: z.string().min(6),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  const validation = schema.safeParse(JSON.parse(req.body));
  if (!validation.success) return res.status(400).json({ message: 'Invalid input' });

  await dbConnect();

  const { transactionId, txnId } = validation.data;
  const txn = await PaymentTransaction.findById(transactionId);

  if (!txn) return res.status(404).json({ message: 'Transaction not found' });

  txn.upiTxnId = txnId;
  txn.status = 'SUCCESS'; // In real world, you’d verify it first
  await txn.save();

  return res.status(200).json({ message: 'Transaction confirmed' });
}