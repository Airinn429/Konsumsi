import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function transferOrder() {
  console.log('🔄 Transfer order dari nadia ke Riza Ilhamsyah...\n');

  try {
    // Cek apakah user Riza sudah ada
    const rizaUser = await prisma.user.findUnique({
      where: { username: 'Riza Ilhamsyah' }
    });

    if (!rizaUser) {
      console.error('❌ User "Riza Ilhamsyah" tidak ditemukan!');
      console.log('💡 Jalankan dulu: npx tsx scripts/add-user.ts');
      return;
    }

    // Update semua order yang yangMengajukan mengandung "Riza"
    const result = await prisma.order.updateMany({
      where: {
        createdBy: 'nadia', // Order yang dibuat oleh nadia
        yangMengajukan: {
          contains: 'Riza', // Yang form-nya isi nama Riza
        },
      },
      data: {
        createdBy: 'Riza Ilhamsyah', // Pindahkan ke user Riza
      },
    });

    console.log('✅ Berhasil transfer', result.count, 'order ke Riza Ilhamsyah');
    console.log('\n💡 Sekarang order tersebut akan muncul di akun Riza Ilhamsyah');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

transferOrder();
