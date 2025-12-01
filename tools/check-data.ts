import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking database content...\n');

  // Cek User
  const userCount = await prisma.user.count();
  console.log(`👥 Users: ${userCount} records`);
  if (userCount > 0) {
    const users = await prisma.user.findMany({ take: 3 });
    console.log('Sample users:', users.map(u => ({ username: u.username, name: u.name })));
  }

  // Cek Order
  const orderCount = await prisma.order.count();
  console.log(`\n📦 Orders: ${orderCount} records`);
  if (orderCount > 0) {
    const orders = await prisma.order.findMany({ take: 3 });
    console.log('Sample orders:', orders.map(o => ({ orderNumber: o.orderNumber, kegiatan: o.kegiatan })));
  }

  // Cek JenisKegiatan
  const kegiatanCount = await prisma.jenisKegiatan.count();
  console.log(`\n📋 Jenis Kegiatan: ${kegiatanCount} records`);
  if (kegiatanCount > 0) {
    const kegiatan = await prisma.jenisKegiatan.findMany({ take: 3 });
    console.log('Sample:', kegiatan.map(k => k.nama));
  }

  // Cek Bagian
  const bagianCount = await prisma.bagian.count();
  console.log(`\n🏢 Bagian: ${bagianCount} records`);
  if (bagianCount > 0) {
    const bagian = await prisma.bagian.findMany({ take: 3 });
    console.log('Sample:', bagian.map(b => b.nama));
  }

  // Cek Approver
  const approverCount = await prisma.approver.count();
  console.log(`\n✅ Approver: ${approverCount} records`);
  if (approverCount > 0) {
    const approver = await prisma.approver.findMany({ take: 3 });
    console.log('Sample:', approver.map(a => a.nama));
  }

  // Cek Lokasi
  const lokasiCount = await prisma.lokasi.count();
  console.log(`\n📍 Lokasi: ${lokasiCount} records`);
  if (lokasiCount > 0) {
    const lokasi = await prisma.lokasi.findMany({ take: 3 });
    console.log('Sample:', lokasi.map(l => l.nama));
  }

  // Cek JenisKonsumsi
  const konsumsiCount = await prisma.jenisKonsumsi.count();
  console.log(`\n🍽️  Jenis Konsumsi: ${konsumsiCount} records`);
  if (konsumsiCount > 0) {
    const konsumsi = await prisma.jenisKonsumsi.findMany({ take: 3 });
    console.log('Sample:', konsumsi.map(k => k.nama));
  }

  // Cek ConsumptionItem
  const itemCount = await prisma.consumptionItem.count();
  console.log(`\n📝 Consumption Items: ${itemCount} records`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
