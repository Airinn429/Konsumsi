// scripts/add-order.ts
// Script untuk menambah order baru ke database
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addOrder() {
  console.log('📦 Menambahkan order baru...\n');

  try {
    // Ambil nomor order terakhir
    const lastOrder = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    let orderNumber = 'KSM-001';
    if (lastOrder && lastOrder.orderNumber) {
      const lastNumber = parseInt(lastOrder.orderNumber.split('-')[1]);
      orderNumber = `KSM-${String(lastNumber + 1).padStart(3, '0')}`;
    }

    // Buat user dulu jika belum ada
    const user = await prisma.user.upsert({
      where: { username: 'nadia' },
      update: {},
      create: {
        username: 'nadia',
        password: '123456',
        name: 'Nadia Addnan',
        email: 'nadia@example.com',
        role: 'user',
      },
    });

    // Buat order baru
    const order = await prisma.order.create({
      data: {
        orderNumber,
        kegiatan: 'Rapat Internal',
        tanggalPermintaan: new Date(),
        tanggalPengiriman: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 hari dari sekarang
        untukBagian: 'Teknologi Informasi',
        yangMengajukan: 'Nadia Addnan - 3082589',
        noHp: '-',
        namaApprover: 'Arief Darmawan (3072535)',
        tipeTamu: 'Regular',
        keterangan: 'Rapat internal tim IT',
        status: 'Pending',
        createdBy: user.username,
        items: {
          create: [
            {
              jenisKonsumsi: 'Nasi Box',
              qty: 30,
              satuan: 'Box',
              lokasiPengiriman: 'Gedung Pusat Administrasi',
              sesiWaktu: 'Siang',
              waktu: '12:00',
            },
            {
              jenisKonsumsi: 'Snack Box',
              qty: 30,
              satuan: 'Box',
              lokasiPengiriman: 'Gedung Pusat Administrasi',
              sesiWaktu: 'Pagi',
              waktu: '09:00',
            },
            {
              jenisKonsumsi: 'Air Mineral',
              qty: 30,
              satuan: 'Unit',
              lokasiPengiriman: 'Gedung Pusat Administrasi',
              sesiWaktu: 'Siang',
              waktu: '12:00',
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });

    console.log('✅ Order berhasil ditambahkan!');
    console.log('   Order Number:', order.orderNumber);
    console.log('   Kegiatan:', order.kegiatan);
    console.log('   Untuk Bagian:', order.untukBagian);
    console.log('   Yang Mengajukan:', order.yangMengajukan);
    console.log('   Tanggal Pengiriman:', order.tanggalPengiriman.toLocaleDateString('id-ID'));
    console.log('   Jumlah Items:', order.items.length);
    console.log('\n   Items:');
    order.items.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.jenisKonsumsi} - ${item.qty} ${item.satuan}`);
    });

    console.log('\n📊 Cek di Prisma Studio: http://localhost:5555');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Jalankan
addOrder();
