import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password';

const prisma = new PrismaClient();

async function addUser() {
  console.log('👤 Menambahkan user baru...\n');

  try {
    const users = [
      { username: 'nadia', name: 'Nadia Addnan', email: 'nadia@demplon.com', pass: '123456' },
      { username: 'fauzi', name: 'Fauzi', email: 'fauzi@demplon.com', pass: '654321' },
      { username: 'dika', name: 'Dika', email: 'dika@demplon.com', pass: '112233' }
    ];

    for (const u of users) {
      const passwordHash = await hashPassword(u.pass);

      const user = await prisma.user.upsert({
        where: { username: u.username },
        update: {
          password: passwordHash,
          name: u.name,
          email: u.email,
        },
        create: {
          username: u.username,
          name: u.name,
          email: u.email,
          password: passwordHash,
          role: 'user',
        },
      });

      console.log(`✅ User ${user.username} berhasil ditambahkan/diupdate`);
    }

    console.log('\n💡 Semua user berhasil ditambahkan!');
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
  } finally {
    await prisma.$disconnect();
  }
}

addUser();
