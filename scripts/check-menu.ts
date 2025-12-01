import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMenuTables() {
  try {
    console.log('🔍 Mengecek tabel Menu dan SesiWaktu...\n');
    
    const menuCount = await prisma.menu.count();
    const sesiCount = await prisma.sesiWaktu.count();
    
    console.log('✅ Tabel Menu:', menuCount, 'records');
    console.log('✅ Tabel SesiWaktu:', sesiCount, 'records');
    
    if (menuCount > 0) {
      console.log('\n📋 Sample Menu (5 items):');
      const sampleMenu = await prisma.menu.findMany({ take: 5 });
      sampleMenu.forEach(m => console.log(`  - ${m.nama} (${m.sesiWaktu})`));
    }
    
    if (sesiCount > 0) {
      console.log('\n⏰ Sesi Waktu:');
      const sesiWaktu = await prisma.sesiWaktu.findMany({ orderBy: { urutan: 'asc' } });
      sesiWaktu.forEach(s => console.log(`  ${s.urutan}. ${s.nama}`));
    }
    
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
  } finally {
    await prisma.$disconnect();
  }
}

checkMenuTables();
