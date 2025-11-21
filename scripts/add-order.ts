// scripts/add-order.ts
// Script untuk menambah order baru ke database
import { PrismaClient, type Prisma } from '@prisma/client';
import { generatePrefixedId } from '../src/lib/id-generator';
import { hashPassword } from '../src/lib/password';

const prisma = new PrismaClient();

async function addOrder() {
  console.log('📦 Menambahkan order baru...\n');

  try {
    // Buat user dulu jika belum ada
    const passwordHash = await hashPassword('123456');

    const user = await prisma.user.upsert({
      where: { username: 'nadia' },
      update: { password: passwordHash },
      create: {
        username: 'nadia',
        password: passwordHash,
        name: 'Nadia Addnan',
        email: 'nadia@demplon.com',
        role: 'user',
      },
    });

    const orderId = await generatePrefixedId(prisma, 'order');

    const lastOrderForUser = await prisma.order.findFirst({
      where: { createdBy: user.username },
      orderBy: { orderNumber: 'desc' },
      select: { orderNumber: true },
    });

    const orderNumber = lastOrderForUser 
      ? String(parseInt(lastOrderForUser.orderNumber) + 1).padStart(5, '0')
      : 'ORD-00001';

    // Buat order baru
    const order = await prisma.order.create({
      data: {
        id: orderId,
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
        user: true,
      },
    }) as Prisma.OrderGetPayload<{ include: { items: true; user: true } }>;

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
