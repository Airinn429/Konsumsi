// prisma/seed.ts
import { PrismaClient } from '@prisma/client';  // ✅ Path standar

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'admin123',
      name: 'Administrator',
      email: 'admin@demplon.com',
      role: 'admin',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { username: 'nadia' },
    update: {},
    create: {
      username: 'nadia',
      password: '123456',
      name: 'Nadia Addnan',
      email: 'nadia@demplon.com',
      role: 'user',
    },
  });

  console.log('✅ Users created:', { user1, user2 });

  // Create master data - Jenis Kegiatan
  const kegiatanList = [
    'Rapat Internal',
    'Rapat Eksternal',
    'Workshop',
    'Seminar',
    'Training',
    'Pelatihan',
    'Lain-lain'
  ];

  for (const nama of kegiatanList) {
    await prisma.jenisKegiatan.upsert({
      where: { nama },
      update: {},
      create: { nama },
    });
  }
  console.log('✅ Jenis Kegiatan created');

  // Create master data - Bagian/Departemen
  const bagianList = [
    { nama: 'IT', kode: 'IT' },
    { nama: 'HRD', kode: 'HRD' },
    { nama: 'Finance', kode: 'FIN' },
    { nama: 'Marketing', kode: 'MKT' },
    { nama: 'Operations', kode: 'OPS' },
  ];

  for (const bagian of bagianList) {
    await prisma.bagian.upsert({
      where: { nama: bagian.nama },
      update: {},
      create: bagian,
    });
  }
  console.log('✅ Bagian created');

  // Create master data - Approver
  const approverList = [
    { nama: 'Budi Santoso', nip: '123456', jabatan: 'Manager IT' },
    { nama: 'Siti Nurhaliza', nip: '123457', jabatan: 'Manager HRD' },
    { nama: 'Ahmad Wijaya', nip: '123458', jabatan: 'Manager Finance' },
  ];

  for (const approver of approverList) {
    await prisma.approver.upsert({
      where: { nip: approver.nip },
      update: {},
      create: approver,
    });
  }
  console.log('✅ Approver created');

  // Create master data - Lokasi
  const lokasiList = [
    { nama: 'Ruang Meeting Lt. 1', kategori: 'Gedung A' },
    { nama: 'Ruang Meeting Lt. 2', kategori: 'Gedung A' },
    { nama: 'Ruang Meeting Lt. 3', kategori: 'Gedung A' },
    { nama: 'Auditorium', kategori: 'Gedung B' },
    { nama: 'Lapangan Parkir', kategori: 'Outdoor' },
  ];

  for (const lokasi of lokasiList) {
    await prisma.lokasi.upsert({
      where: { nama: lokasi.nama },
      update: {},
      create: lokasi,
    });
  }
  console.log('✅ Lokasi created');

  // Create master data - Jenis Konsumsi
  const konsumsiList = [
    { nama: 'Nasi Kotak', kategori: 'Makanan Berat', satuanDefault: 'Porsi' },
    { nama: 'Nasi Tumpeng', kategori: 'Makanan Berat', satuanDefault: 'Paket' },
    { nama: 'Snack Box', kategori: 'Snack', satuanDefault: 'Box' },
    { nama: 'Kue Tradisional', kategori: 'Snack', satuanDefault: 'Porsi' },
    { nama: 'Air Mineral', kategori: 'Minuman', satuanDefault: 'Botol' },
    { nama: 'Teh/Kopi', kategori: 'Minuman', satuanDefault: 'Porsi' },
    { nama: 'Jus Buah', kategori: 'Minuman', satuanDefault: 'Gelas' },
  ];

  for (const konsumsi of konsumsiList) {
    await prisma.jenisKonsumsi.upsert({
      where: { nama: konsumsi.nama },
      update: {},
      create: konsumsi,
    });
  }
  console.log('✅ Jenis Konsumsi created');

  // Create sample order
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: 'KSM-001',
      kegiatan: 'Rapat Internal',
      tanggalPermintaan: new Date('2025-11-10'),
      tanggalPengiriman: new Date('2025-11-15'),
      untukBagian: 'IT',
      yangMengajukan: 'Nadia Addnan - 123457',
      noHp: '08123456789',
      namaApprover: 'Budi Santoso',
      tipeTamu: 'Regular',
      keterangan: 'Rapat koordinasi bulanan',
      status: 'Pending',
      createdBy: user2.username,
      items: {
        create: [
          {
            jenisKonsumsi: 'Nasi Kotak',
            qty: 30,
            satuan: 'Porsi',
            lokasiPengiriman: 'Ruang Meeting Lt. 3',
            sesiWaktu: 'Siang',
            waktu: '12:00',
          },
          {
            jenisKonsumsi: 'Air Mineral',
            qty: 30,
            satuan: 'Botol',
            lokasiPengiriman: 'Ruang Meeting Lt. 3',
            sesiWaktu: 'Siang',
            waktu: '12:00',
          },
          {
            jenisKonsumsi: 'Snack Box',
            qty: 30,
            satuan: 'Box',
            lokasiPengiriman: 'Ruang Meeting Lt. 3',
            sesiWaktu: 'Pagi',
            waktu: '09:00',
          },
        ],
      },
    },
    include: {
      items: true,
    },
  });

  console.log('✅ Sample order created:', sampleOrder);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
