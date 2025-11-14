import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addUser() {
  console.log('👤 Menambahkan user baru...\n');

  try {
    // Ganti data di bawah ini sesuai kebutuhan
    const newUser = await prisma.user.create({
      data: {
        username: 'Riza Ilhamsyah',      // ⬅️ Ganti username
        password: '12231149',     // ⬅️ Ganti password
        name: 'Riza Ilhamsyah',   // ⬅️ Ganti nama lengkap
        email: 'riza@example.com',   // ⬅️ Ganti email (opsional)
        role: 'user',                // ⬅️ Pilih: 'user', 'admin', atau 'approver'
      },
    });

    console.log('✅ User berhasil ditambahkan!');
    console.log('   Username: ', newUser.username);
    console.log('   Name:', newUser.name);
    console.log('   Email:', newUser.email);
    console.log('   Role:', newUser.role);
    console.log('   ID:', newUser.id);
    
    console.log('\n💡 Sekarang user bisa login dengan:');
    console.log('   Username:', newUser.username);
    console.log('   Password: (yang Anda set di atas)');
    
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
