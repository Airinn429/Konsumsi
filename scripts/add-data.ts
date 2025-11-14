// scripts/add-data.ts
// Script untuk menambahkan semua data (User + Master Data + Order)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addData() {
  console.log('📝 Menambahkan data ke database...\n');

  try {
    // 1. Tambah User
    console.log('👤 Menambahkan user...');
    const user = await prisma.user.create({
      data: {
        username: 'nadia',
        password: '123456',
        name: 'Nadia Addnan',
        email: 'nadia@demplon.com',
        role: 'user',
      },
    });
    console.log('✅ User berhasil ditambahkan:', user.username);

    // 2. Tambah Order dengan Items
    console.log('\n📦 Menambahkan order...');
    const order = await prisma.order.create({
      data: {
        orderNumber: 'KSM-001',
        kegiatan: 'Rapat Internal',
        tanggalPermintaan: new Date('2025-11-11'),
        tanggalPengiriman: new Date('2025-11-13'),
        untukBagian: 'Teknologi Informasi',
        yangMengajukan: 'Nadia Addnan - 3082589',
        noHp: '-',
        namaApprover: 'Arief Darmawan (3072535)',
        tipeTamu: 'Regular',
        keterangan: 'Rapat koordinasi tim IT',
        status: 'Pending',
        createdBy: user.username,
        items: {
          create: [
            {
              jenisKonsumsi: 'Nasi Box',
              qty: 25,
              satuan: 'Box',
              lokasiPengiriman: 'Gedung Anggrek',
              sesiWaktu: 'Siang',
              waktu: '12:00',
            },
            {
              jenisKonsumsi: 'Snack Box',
              qty: 25,
              satuan: 'Box',
              lokasiPengiriman: 'Gedung Anggrek',
              sesiWaktu: 'Sore',
              waktu: '15:00',
            },
            {
              jenisKonsumsi: 'Air Mineral',
              qty: 30,
              satuan: 'Unit',
              lokasiPengiriman: 'Gedung Anggrek',
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
    console.log('✅ Order berhasil ditambahkan:', order.orderNumber);
    console.log('   - Kegiatan:', order.kegiatan);
    console.log('   - Items:', order.items.length, 'item');

    console.log('\n🎉 Semua data berhasil ditambahkan!');
    console.log('💡 Untuk menambahkan master data, jalankan: npx tsx scripts/seed-master-data.ts');
    console.log('\n📊 Cek di Prisma Studio: http://localhost:5555');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Jalankan
addData();
