import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🗑️  Memulai proses penghapusan multiple users...\n");
  
  try {
    // Tampilkan semua user dulu
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
      }
    });
    
    console.log("📋 Daftar semua user:");
    allUsers.forEach(user => {
      console.log(`   - Username: "${user.username}", Name: ${user.name}, Email: ${user.email}`);
    });
    console.log();

    // ⚠️ EDIT DISINI: Masukkan username yang ingin dihapus
    const usernameToDelete = [
      "nadia addnan",      // Ganti dengan username yang mau dihapus
      "admin",      // Ganti dengan username yang mau dihapus
     "Riza Ilhamsyah",  
    ];

    console.log("🎯 Target penghapusan:");
    usernameToDelete.forEach(username => {
      console.log(`   - ${username}`);
    });
    console.log();

    // Cek berapa user yang akan dihapus
    const usersToDelete = await prisma.user.findMany({
      where: {
        username: {
          in: usernameToDelete
        }
      }
    });

    if (usersToDelete.length === 0) {
      console.log("❌ Tidak ada user yang ditemukan untuk dihapus");
      return;
    }

    console.log(`✓ Ditemukan ${usersToDelete.length} user yang akan dihapus:`);
    usersToDelete.forEach(user => {
      console.log(`   - ${user.username} (${user.name})`);
    });
    console.log();

    // Hapus semua user sekaligus
    const result = await prisma.user.deleteMany({
      where: {
        username: {
          in: usernameToDelete
        }
      }
    });
    
    console.log(`\n✅ Berhasil menghapus ${result.count} user!\n`);

    // Tampilkan user yang tersisa
    const remainingUsers = await prisma.user.findMany({
      select: {
        username: true,
        name: true,
      }
    });

    console.log("📋 User yang tersisa:");
    if (remainingUsers.length === 0) {
      console.log("   (Tidak ada user)");
    } else {
      remainingUsers.forEach(user => {
        console.log(`   - ${user.username} (${user.name})`);
      });
    }

  } catch (error: unknown) {
    console.error("\n❌ Terjadi error:");
    if (error && typeof error === 'object' && 'code' in error) {
      console.error("Code:", (error as { code: string }).code);
    }
    if (error && typeof error === 'object' && 'message' in error) {
      console.error("Message:", (error as { message: string }).message);
    }
    throw error;
  }
}

main()
  .catch((error) => {
    console.error("Fatal Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
