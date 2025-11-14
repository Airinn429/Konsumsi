// src/pages/api/orders/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  // ID is a string (CUID), no need to parse to integer
  const orderId = id;

  if (req.method === 'GET') {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: true,
          user: true,
        },
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      return res.status(200).json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      return res.status(500).json({ error: 'Failed to fetch order' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { status, cancelReason } = req.body;

      const updateData: {
        status?: string;
        tanggalPembatalan?: Date;
        alasanPembatalan?: string;
      } = {};

      if (status) {
        updateData.status = status;
        if (status === 'Cancelled' || status === 'cancelled') {
          updateData.tanggalPembatalan = new Date();
          if (cancelReason) {
            updateData.alasanPembatalan = cancelReason;
          }
        }
      }

      const order = await prisma.order.update({
        where: { id: orderId },
        data: updateData,
        include: {
          items: true,
          user: true,
        },
      });

      return res.status(200).json(order);
    } catch (error) {
      console.error('Error updating order:', error);
      return res.status(500).json({ error: 'Failed to update order' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
