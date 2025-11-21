// src/pages/api/orders/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { generatePrefixedId } from '@/lib/id-generator';

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
      // Get username dari query parameter
      const { username } = req.query;
      
      if (!username || typeof username !== 'string') {
        return res.status(400).json({ 
          error: 'Username is required',
          message: 'Please provide username in query parameter'
        });
      }

      console.log('🔍 Fetching orders for user:', username);
      
      // Filter orders berdasarkan createdBy (username yang login)
      const orders = await prisma.order.findMany({
        where: {
          createdBy: username, // Hanya ambil order milik user ini
        },
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

      console.log('✅ Orders fetched for', username, ':', orders.length);
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
        where: { createdBy },
        orderBy: {
          orderNumber: 'desc',
        },
        select: {
          orderNumber: true,
        },
      });

      const orderNumber = (lastOrder?.orderNumber ?? 0) + 1;

      // Generate custom ID for order
      const orderId = await generatePrefixedId(prisma, 'order');

      // Create order with items
      const order = await prisma.order.create({
        data: {
          id: orderId,
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
