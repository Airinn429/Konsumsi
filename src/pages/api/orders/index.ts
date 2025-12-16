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
  // ----------------------------------------------------------------------
  // HANDLER GET: Mengambil Data Order
  // ----------------------------------------------------------------------
  if (req.method === 'GET') {
    try {
      // Ambil username dan role dari query parameter
      // Contoh request User: /api/orders?username=jojok
      // Contoh request Approver: /api/orders?username=arief&role=approver
      const { username, role } = req.query;

      if (!username || typeof username !== 'string') {
        return res.status(400).json({
          error: 'Username is required',
          message: 'Please provide username in query parameter'
        });
      }

      console.log(`🔍 Fetching orders. User: ${username}, Role: ${role || 'user'}`);

      let orders;

      // --- SKENARIO 1: APPROVER ---
      // Jika role adalah approver, dia bisa melihat order orang lain
      // Biasanya approver hanya perlu melihat yang statusnya 'Pending' atau yang dia approve
      if (role === 'approver') {
        orders = await prisma.order.findMany({
          where: {
            // Opsional: Filter hanya yang statusnya 'Pending' agar approver fokus kerja
            // status: 'Pending', 
            
            // Opsional: Jika Anda ingin approver hanya melihat order yang ditujukan padanya
            // namaApprover: { contains: username } 
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
        console.log('✅ [Approver Mode] Fetched all orders:', orders.length);
      } 
      
      // --- SKENARIO 2: USER BIASA ---
      // User hanya boleh melihat order miliknya sendiri
      else {
        orders = await prisma.order.findMany({
          where: {
            createdBy: username, // Filter WAJIB untuk user biasa
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
        console.log('✅ [User Mode] Fetched personal orders:', orders.length);
      }

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

  // ----------------------------------------------------------------------
  // HANDLER POST: Membuat Order Baru (Tidak Berubah)
  // ----------------------------------------------------------------------
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
        // ... log lainnya
        createdBy,
      });

      // Validasi data wajib
      if (!kegiatan || !tanggalPermintaan || !tanggalPengiriman || !untukBagian || !yangMengajukan || !createdBy) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['kegiatan', 'tanggalPermintaan', 'tanggalPengiriman', 'untukBagian', 'yangMengajukan', 'createdBy']
        });
      }

      // Validasi items
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          error: 'At least one item is required'
        });
      }

      // Validasi user exists
      const user = await prisma.user.findUnique({
        where: { username: createdBy },
      });

      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: `User with username "${createdBy}" does not exist. Please login again.`
        });
      }

      // Generate order number
      const totalOrderCount = await prisma.order.count();
      const orderNumber = `KSM-${String(totalOrderCount + 1).padStart(4, '0')}`;

      // Generate custom ID
      const orderId = await generatePrefixedId(prisma, 'order');

      // Create order
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