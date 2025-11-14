// scripts/update-user.ts
// Script untuk update email user yang sudah ada
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUser() {
  console.log('📝 Update user nadia...\n');

  try {
    const user = await prisma.user.update({
      where: { username: 'nadia' },
      data: {
        email: 'nadia@demplon.com',
        password: '123456', // Pastikan password juga terisi
      },
    });
    
    console.log('✅ User berhasil diupdate!');
    console.log('   Username:', user.username);
    console.log('   Name:', user.name);
    console.log('   Email:', user.email);
    console.log('   Password: 123456');
    console.log('\n📊 Refresh Prisma Studio untuk melihat perubahan');
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
  } finally {
    await prisma.$disconnect();
  }
}

// Jalankan
updateUser();
