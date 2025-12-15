// src/pages/api/orders/approval.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { approverName } = req.query;

  if (!approverName || typeof approverName !== 'string') {
    return res.status(400).json({ error: 'Approver name is required' });
  }

  try {
    console.log(`🔍 Mencari order untuk Approver: ${approverName}`);

    const orders = await prisma.order.findMany({
      where: {
        // Cari order yang nama approvernya cocok DAN statusnya masih Pending
        // Atau status lain jika ingin melihat history approval
        namaApprover: approverName,
      },
      include: {
        items: true, // Sertakan item konsumsi
        user: {
            select: { username: true, name: true }
        }
      },
      orderBy: {
        createdAt: 'desc', // Yang terbaru di atas
      },
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching approval list:', error);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
}