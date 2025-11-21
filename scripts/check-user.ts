// scripts/check-user.ts
// Script untuk cek user data di database
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
  console.log('🔍 Mengecek user di database...\n');

  try {
    const users = await prisma.user.findMany({
      select: {
        username: true,
        passwordHash: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (users.length === 0) {
      console.log('❌ Tidak ada user di database!');
      console.log('💡 Jalankan: npx tsx scripts/add-data.ts');
      return;
    }

    console.log(`✅ Ditemukan ${users.length} user:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Username: ${user.username}`);
      console.log(`   Password Hash: ${user.passwordHash}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email || 'null'}`);
      console.log(`   Role: ${user.role}`);
      console.log('');
    });

    console.log('💡 Untuk login, gunakan:');
    console.log(`   Username: ${users[0].username}`);
    console.log(`   Password Hash: ${users[0].passwordHash}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
