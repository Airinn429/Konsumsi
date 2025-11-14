// src/pages/api/orders/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

// Interface untuk item konsumsi
interface ConsumptionItemInput {
  jenisKonsumsi: string;
  qty: number | string;
  satuan: string;
  lokasiPengiriman: string;
  sesiWaktu: string;
  waktu: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      console.log('🔍 Fetching orders from database...');
      const orders = await prisma.order.findMany({
        include: {
          items: true,
          user: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      console.log('✅ Orders fetched:', orders.length);
      return res.status(200).json(orders);
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown');
      return res.status(500).json({ 
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        kegiatan,
        kegiatanLainnya,
        tanggalPermintaan,
        tanggalPengiriman,
        untukBagian,
        yangMengajukan,
        noHp,
        namaApprover,
        tipeTamu,
        keterangan,
        items,
        createdBy,
      } = req.body;

      console.log('📝 Creating order with data:', {
        kegiatan,
        kegiatanLainnya,
        tanggalPermintaan,
        tanggalPengiriman,
        untukBagian,
        yangMengajukan,
        noHp,
        namaApprover,
        tipeTamu,
        keterangan,
        itemsCount: items?.length || 0,
        createdBy,
      });

      // Validasi data wajib
      if (!kegiatan || !tanggalPermintaan || !tanggalPengiriman || !untukBagian || !yangMengajukan || !createdBy) {
        console.error('❌ Missing required fields');
        return res.status(400).json({ 
          error: 'Missing required fields',
          required: ['kegiatan', 'tanggalPermintaan', 'tanggalPengiriman', 'untukBagian', 'yangMengajukan', 'createdBy']
        });
      }

      // Validasi items
      if (!items || !Array.isArray(items) || items.length === 0) {
        console.error('❌ No items provided');
        return res.status(400).json({ 
          error: 'At least one item is required'
        });
      }

      // Generate order number
      const lastOrder = await prisma.order.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
      });

      let orderNumber = 'KSM-001';
      if (lastOrder && lastOrder.orderNumber) {
        const lastNumber = parseInt(lastOrder.orderNumber.split('-')[1]);
        orderNumber = `KSM-${String(lastNumber + 1).padStart(3, '0')}`;
      }

      // Create order with items
      const order = await prisma.order.create({
        data: {
          orderNumber,
          kegiatan,
          kegiatanLainnya: kegiatanLainnya || null,
          tanggalPermintaan: new Date(tanggalPermintaan),
          tanggalPengiriman: new Date(tanggalPengiriman),
          untukBagian,
          yangMengajukan,
          noHp: noHp || '',
          namaApprover: namaApprover || '',
          tipeTamu: tipeTamu || null,
          keterangan: keterangan || null,
          status: 'Pending',
          createdBy,
          items: {
            create: items.map((item: ConsumptionItemInput) => ({
              jenisKonsumsi: item.jenisKonsumsi,
              qty: typeof item.qty === 'string' ? parseInt(item.qty) : item.qty,
              satuan: item.satuan,
              lokasiPengiriman: item.lokasiPengiriman,
              sesiWaktu: item.sesiWaktu,
              waktu: item.waktu,
            })),
          },
        },
        include: {
          items: true,
          user: true,
        },
      });

      console.log('✅ Order created:', order.orderNumber);
      return res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({ 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
