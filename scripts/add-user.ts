import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password';

const prisma = new PrismaClient();

async function addUser() {
  console.log('👤 Menambahkan user baru...\n');

  try {
    // User 1: Riza Ilhamsyah
    const passwordHash1 = await hashPassword('123456');
    const user1 = await prisma.user.create({
      data: {
        username: 'nadia addnan',
        password: passwordHash1,
        name: 'nadia addnan',
        email: 'nadia@example.com',
        role: 'user',
      },
    });

    console.log('✅ User 1 berhasil ditambahkan!');
    console.log('   Username:', user1.username);
    console.log('   Name:', user1.name);
    console.log('   Email:', user1.email);
    console.log('   Role:', user1.role);
    console.log('   ID:', user1.id);
    console.log();

    // User 2: Fauzi
    const passwordHash2 = await hashPassword('654321');
    const user2 = await prisma.user.create({
      data: {
        username: 'Fauzi',
        password: passwordHash2,
        name: 'Fauzi',
        email: 'fauzi@example.com',
        role: 'user',
      },
    });

    console.log('✅ User 2 berhasil ditambahkan!');
    console.log('   Username:', user2.username);
    console.log('   Name:', user2.name);
    console.log('   Email:', user2.email);
    console.log('   Role:', user2.role);
    console.log('   ID:', user2.id);
    
    console.log('\n💡 Kedua user sekarang bisa login!');
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        console.error('❌ Error: Username atau email sudah digunakan!');
      } else {
        console.error('❌ Error:', error.message);
      }
    } else {
      console.error('❌ Error:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Jalankan
addUser();
