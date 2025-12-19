import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1. Ambil ID dari URL (nama file [id].ts akan mengisi req.query.id)
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  // 2. Handle request PATCH (Update Status)
  if (req.method === 'PATCH') {
    try {
      const { status, cancelReason } = req.body;

      console.log(`🔄 Request Update Order ID: ${id}`);
      console.log(`➡️ New Status: ${status}`);

      // Validasi status
      const validStatuses = ['Approved', 'Rejected', 'Cancelled', 'Pending'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Allowed: ${validStatuses.join(', ')}` });
      }

      // Lakukan Update ke Database
      const updatedOrder = await prisma.order.update({
        where: { id: id },
        data: {
          status: status,
          // Update alasan penolakan
        },
      });

      console.log("✅ Update Success");
      return res.status(200).json(updatedOrder);

    } catch (error) {
      console.error('❌ Error updating order:', error);
      return res.status(500).json({ 
        error: 'Failed to update order', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  // Jika method bukan PATCH
  res.setHeader('Allow', ['PATCH']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}