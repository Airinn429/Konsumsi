// scripts/update-user.ts
// Script untuk update email user yang sudah ada
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password';

const prisma = new PrismaClient();

async function updateUser() {
  console.log('📝 Update user nadia...\n');

  try {
    const passwordHash = await hashPassword('123456');

    const user = await prisma.user.update({
      where: { username: 'nadia' },
      data: {
        email: 'nadia@demplon.com',
        password: passwordHash,
      },
    });
    
    console.log('✅ User berhasil diupdate!');
    console.log('   Username:', user.username);
    console.log('   Name:', user.name);
    console.log('   Email:', user.email);
    console.log('   Password: (disimpan sebagai hash)');
    console.log('\n📊 Refresh Prisma Studio untuk melihat perubahan');
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
  } finally {
    await prisma.$disconnect();
  }
}

// Jalankan
updateUser();
