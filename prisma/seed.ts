import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Mulai seeding database...\n");

  // ====================== USER ======================
  console.log("👤 Menambahkan users...");
  const adminPassword = await hashPassword("admin123");
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: { 
      id: randomUUID(), 
      username: "admin", 
      name: "Administrator", 
      email: "admin@demplon.com",
      password: adminPassword,
      role: "admin"
    }
  });

  const nadiaPassword = await hashPassword("123456");
  await prisma.user.upsert({
    where: { username: "nadia" },
    update: {},
    create: { 
      id: randomUUID(), 
      username: "nadia", 
      name: "Nadia Addnan", 
      email: "nadia@demplon.com",
      password: nadiaPassword,
      role: "user"
    }
  });

  const fauziPassword = await hashPassword("654321");
  await prisma.user.upsert({
    where: { username: "fauzi" },
    update: {},
    create: { 
      id: randomUUID(), 
      username: "fauzi", 
      name: "Fauzi", 
      email: "fauzi@demplon.com",
      password: fauziPassword,
      role: "user"
    }
  });

  const dikaPassword = await hashPassword("112233");
  await prisma.user.upsert({
    where: { username: "dika" },
    update: {},
    create: { 
      id: randomUUID(), 
      username: "dika", 
      name: "Dika", 
      email: "dika@demplon.com",
      password: dikaPassword,
      role: "user"
    }
  });

  // ====================== BAGIAN ======================
  console.log("📋 Menambahkan bagian...");
  const existingBagian = await prisma.bagian.findFirst({ where: { nama: "Teknologi Informasi" } });
  if (!existingBagian) {
    await prisma.bagian.createMany({
      data: [
        { id: randomUUID(), nama: "Teknologi Informasi" },
      ]
    });
  }

  // ====================== JENIS KEGIATAN ======================
  console.log("📋 Menambahkan jenis kegiatan...");
  const existingKegiatan = await prisma.jenisKegiatan.count();
  if (existingKegiatan === 0) {
    await prisma.jenisKegiatan.createMany({
      data: [
        { id: randomUUID(), nama: "Bahan Minum Karyawan" },
        { id: randomUUID(), nama: "Baporkes" },
        { id: randomUUID(), nama: "BK3N" },
        { id: randomUUID(), nama: "Extra Fooding" },
        { id: randomUUID(), nama: "Extra Fooding Shift" },
        { id: randomUUID(), nama: "Extra Fooding SKJ" },
        { id: randomUUID(), nama: "Festival Inovasi" },
        { id: randomUUID(), nama: "Halal Bi Halal" },
        { id: randomUUID(), nama: "Hari Guru" },
        { id: randomUUID(), nama: "Hari Raya Idu Adha" },
        { id: randomUUID(), nama: "Hari Raya Idul Fitri" },
        { id: randomUUID(), nama: "HUT PKC" },
        { id: randomUUID(), nama: "HUT RI" },
        { id: randomUUID(), nama: "Jamuan Diluar Kawasan" },
        { id: randomUUID(), nama: "Jamuan Tamu Perusahaan" },
        { id: randomUUID(), nama: "Jumat Bersih" },
        { id: randomUUID(), nama: "Kajian Rutin" },
        { id: randomUUID(), nama: "Ketupat Lebaran" },
        { id: randomUUID(), nama: "Konsumsi Buka Puasa" },
        { id: randomUUID(), nama: "Konsumsi Makan Sahur" },
        { id: randomUUID(), nama: "Konsumsi TA" },
        { id: randomUUID(), nama: "Lain-lain Jamuan Tamu" },
        { id: randomUUID(), nama: "Lain-lain Perayaan" },
        { id: randomUUID(), nama: "Lain-lain Rapat Kantor" },
        { id: randomUUID(), nama: "Lembur Perta" },
        { id: randomUUID(), nama: "Lembur Rutin" },
        { id: randomUUID(), nama: "Lembur Shutdown" },
        { id: randomUUID(), nama: "Not Defined" },
        { id: randomUUID(), nama: "Nuzurul Quran" },
        { id: randomUUID(), nama: "Open Storage" },
        { id: randomUUID(), nama: "Pengajian Keliling" },
        { id: randomUUID(), nama: "Pengantongan Akhir Tahun" },
        { id: randomUUID(), nama: "Pengembangan SDM" },
        { id: randomUUID(), nama: "PKM Masjid Nahlul Hayat" },
        { id: randomUUID(), nama: "Program Akhlak" },
        { id: randomUUID(), nama: "Program Makmur" },
        { id: randomUUID(), nama: "Program WMS" },
        { id: randomUUID(), nama: "Proper Emas" },
        { id: randomUUID(), nama: "Proyek Replacament K1A & NZE" },
        { id: randomUUID(), nama: "Rakor Direksi Anper PI Group" },
        { id: randomUUID(), nama: "Rapat Direksi" },
        { id: randomUUID(), nama: "Rapat Distribusi B" },
        { id: randomUUID(), nama: "Rapat Distribusi D" },
        { id: randomUUID(), nama: "Rapat Gabungan Dekom, Direksi, SVP" },
        { id: randomUUID(), nama: "Rapat Internal" },
        { id: randomUUID(), nama: "Rapat Komite Audit" },
        { id: randomUUID(), nama: "Rapat LKS Bipartit" },
        { id: randomUUID(), nama: "Rapat Monitoring Anper PKC" },
        { id: randomUUID(), nama: "Rapat Pra RUPS" },
        { id: randomUUID(), nama: "Rapat Tamu" },
        { id: randomUUID(), nama: "Rumah Tahfidz" },
        { id: randomUUID(), nama: "Safari Malam Takbiran" },
        { id: randomUUID(), nama: "Safari Ramadhan" },
        { id: randomUUID(), nama: "Shutdwon Pabrik" },
        { id: randomUUID(), nama: "SP2K" },
        { id: randomUUID(), nama: "Srikandi PKC" },
        { id: randomUUID(), nama: "Tablig Akbar" },
        { id: randomUUID(), nama: "Washing Pabrik" }
      ]
    });
  }


  
  // ====================== APPROVER ======================
  console.log("📋 Menambahkan approver...");
  const existingApprover = await prisma.approver.count();
  if (existingApprover === 0) {
    await prisma.approver.createMany({
      data: [
        { id: randomUUID(), nama: "Arief Darmawan", nip: "3072535" },
        { id: randomUUID(), nama: "Anggita Maya Septianingsih", nip: "3082589" },
        { id: randomUUID(), nama: "Agung Gustiawan", nip: "3092789" },
        { id: randomUUID(), nama: "Andika Arif Rachman", nip: "3082592" },
        { id: randomUUID(), nama: "Ardhimas Yuda Baskoro", nip: "3042172" },
        { id: randomUUID(), nama: "Amin Puji Hariyanto", nip: "3133210" },
        { id: randomUUID(), nama: "Andi Komara", nip: "3072517" },
        { id: randomUUID(), nama: "Desra Heriman", nip: "3072531" },
        { id: randomUUID(), nama: "Danang Siswantoro", nip: "3052402" },
        { id: randomUUID(), nama: "Dady Rahman", nip: "3052404" },
        { id: randomUUID(), nama: "Dian Ramdani", nip: "3082628" },
        { id: randomUUID(), nama: "Dede Sopian", nip: "3072524" },
        { id: randomUUID(), nama: "Dian Risdiana", nip: "3072532" },
        { id: randomUUID(), nama: "Dodi Pramadi", nip: "3972081" },
        { id: randomUUID(), nama: "Eka Priyatna", nip: "3102904" },
        { id: randomUUID(), nama: "Fika Hikmaturrahman", nip: "3123195" },
        { id: randomUUID(), nama: "Fajar Nugraha", nip: "3022134" },
        { id: randomUUID(), nama: "Freddy Harianto", nip: "3072526" },
        { id: randomUUID(), nama: "Febri Rubragandi N", nip: "3052400" },
        { id: randomUUID(), nama: "Flan Adi Nugraha Suhara", nip: "3052394" },
        { id: randomUUID(), nama: "Gina Amarilis", nip: "3082590" },
        { id: randomUUID(), nama: "Henisya Permata Sari", nip: "3072498" },
        { id: randomUUID(), nama: "Hikmat Rachmatullah", nip: "3072497" },
        { id: randomUUID(), nama: "Handi Rustian", nip: "3072485" },
        { id: randomUUID(), nama: "Iswahyudi Mertosono", nip: "3082594" },
        { id: randomUUID(), nama: "Indra Irianto", nip: "3022136" },
        { id: randomUUID(), nama: "Ira Purnama Sari", nip: "3072489" },
        { id: randomUUID(), nama: "Ibrahim Herlambang", nip: "3072488" },
        { id: randomUUID(), nama: "Jojok Satriadi", nip: "1140122" },
        { id: randomUUID(), nama: "Jondra", nip: "3052403" },
        { id: randomUUID(), nama: "Kholiq Iman Santoso", nip: "3253473" },
        { id: randomUUID(), nama: "Kasmadi", nip: "3072494" },
        { id: randomUUID(), nama: "Lala", nip: "3072542" },
        { id: randomUUID(), nama: "Luthfianto Ardian", nip: "3022127" },
        { id: randomUUID(), nama: "Mohammad Arief Rachman", nip: "3932032" },
        { id: randomUUID(), nama: "Mulky Wahyudhy", nip: "3082591" },
        { id: randomUUID(), nama: "Mita Yasmitahati", nip: "3072527" },
        { id: randomUUID(), nama: "Mohammad Gani", nip: "3092756" },
        { id: randomUUID(), nama: "Muhammad Ikhsan Anshori", nip: "3133237" },
        { id: randomUUID(), nama: "Muhammad Yudi Prasetyo", nip: "3072487" },
        { id: randomUUID(), nama: "Muh. Arifin Hakim Nuryadin", nip: "3972097" },
        { id: randomUUID(), nama: "Nugraha Agung Wibowo", nip: "3133236" },
        { id: randomUUID(), nama: "Probo Condrosari", nip: "3072490" },
        { id: randomUUID(), nama: "Raden Sulistyo", nip: "3072491" },
        { id: randomUUID(), nama: "R. Idho Pramana Sembada", nip: "3072545" },
        { id: randomUUID(), nama: "Rosy Indra Saputra", nip: "3072496" },
        { id: randomUUID(), nama: "Refan Anggasatriya", nip: "3082597" },
        { id: randomUUID(), nama: "Ronald Irwanto", nip: "3123084" },
        { id: randomUUID(), nama: "Rahayu Ginanjar Siwi", nip: "3123205" },
        { id: randomUUID(), nama: "Shinta Narulita", nip: "3082579" },
        { id: randomUUID(), nama: "Soni Ridho Atmaja", nip: "3082583" },
        { id: randomUUID(), nama: "Sundawa", nip: "3082584" },
        { id: randomUUID(), nama: "Syarifudin", nip: "3052401" },
        { id: randomUUID(), nama: "Toni Gunawan", nip: "3042442" },
        { id: randomUUID(), nama: "Yoyon Daryono", nip: "3072495" },
        { id: randomUUID(), nama: "Yayan Taryana", nip: "3123091" },
        { id: randomUUID(), nama: "Yara Budhi Widowati", nip: "3123085" },
        { id: randomUUID(), nama: "Zaki Faishal Aziz", nip: "3042168" }
      ]
    });
  }


  // ====================== LOKASI ======================
  console.log("📋 Menambahkan lokasi...");
  const existingLokasi = await prisma.lokasi.count();
  if (existingLokasi === 0) {
    await prisma.lokasi.createMany({
      data: [
        { id: randomUUID(), nama: "Bagging" },
        { id: randomUUID(), nama: "CCB" },
        { id: randomUUID(), nama: "Club House" },
        { id: randomUUID(), nama: "Departemen Riset" },
        { id: randomUUID(), nama: "Gedung 101-K" },
        { id: randomUUID(), nama: "Gedung Anggrek" },
        { id: randomUUID(), nama: "Gedung Bidding Center" },
        { id: randomUUID(), nama: "Gedung Contraction Office" },
        { id: randomUUID(), nama: "Gedung K3" },
        { id: randomUUID(), nama: "Gedung LC" },
        { id: randomUUID(), nama: "Gedung Maintanance Office" },
        { id: randomUUID(), nama: "Gedung Mawar" },
        { id: randomUUID(), nama: "Gedung Melati" },
        { id: randomUUID(), nama: "Gedung Purna Bhakti" },
        { id: randomUUID(), nama: "Gedung Pusat Administrasi" },
        { id: randomUUID(), nama: "Gedung RPK" },
        { id: randomUUID(), nama: "Gedung Saorga" },
        { id: randomUUID(), nama: "GH-B" },
        { id: randomUUID(), nama: "GH-C" },
        { id: randomUUID(), nama: "GPA Lt-3" },
        { id: randomUUID(), nama: "Gudang Bahan Baku" },
        { id: randomUUID(), nama: "Gudang Bulk Material" },
        { id: randomUUID(), nama: "Gedung Suku Cadang" },
        { id: randomUUID(), nama: "Jakarta" },
        { id: randomUUID(), nama: "Kantor SP2K" },
        { id: randomUUID(), nama: "Kebon Bibit" },
        { id: randomUUID(), nama: "Klinik PT HPH" },
        { id: randomUUID(), nama: "Kolam Pancing Type B" },
        { id: randomUUID(), nama: "Kolam Renang" },
        { id: randomUUID(), nama: "Kujang Kampioen Riset" },
        { id: randomUUID(), nama: "Laboraturium/Main Lab" },
        { id: randomUUID(), nama: "Lapang Basket Type B" },
        { id: randomUUID(), nama: "Lapang Futsal" },
        { id: randomUUID(), nama: "Lapang Sepak Bola Type E" },
        { id: randomUUID(), nama: "Lapang Tenis Type B" },
        { id: randomUUID(), nama: "Lapang Volly Type E" },
        { id: randomUUID(), nama: "Lapangan Helipad" },
        { id: randomUUID(), nama: "Lapangan Panahan" },
        { id: randomUUID(), nama: "Lapangan Volley" },
        { id: randomUUID(), nama: "Mekanik K1A" },
        { id: randomUUID(), nama: "Mekanik K1B" },
        { id: randomUUID(), nama: "Not Defined" },
        { id: randomUUID(), nama: "NPK-2" },
        { id: randomUUID(), nama: "Pos Selatan 01" },
        { id: randomUUID(), nama: "Posko Pengamanan Bawah" },
        { id: randomUUID(), nama: "Ruang Rapat NPK-1" },
        { id: randomUUID(), nama: "Ruang Rapat NPK-2" },
        { id: randomUUID(), nama: "Utility K-1A" },
        { id: randomUUID(), nama: "Wisma Kujang" }
      ]
    });
  }


  // ====================== JENIS KONSUMSI ======================
  console.log("📋 Menambahkan jenis konsumsi (Tipe Tamu)...");
  const existingJenisKonsumsi = await prisma.jenisKonsumsi.count();
  if (existingJenisKonsumsi === 0) {
    await prisma.jenisKonsumsi.createMany({
      data: [
        { id: randomUUID(), nama: "PERTA" },
        { id: randomUUID(), nama: "Regular" },
        { id: randomUUID(), nama: "Standar" },
        { id: randomUUID(), nama: "VIP" },
        { id: randomUUID(), nama: "VVIP" }
      ]
    });
  }

  // ====================== SESI WAKTU ======================
  console.log("📋 Menambahkan sesi waktu...");
  const existingSesiWaktu = await prisma.sesiWaktu.count();
  if (existingSesiWaktu === 0) {
    await prisma.sesiWaktu.createMany({
      data: [
        { id: randomUUID(), nama: "Pagi", urutan: 1 },
        { id: randomUUID(), nama: "Siang", urutan: 2 },
        { id: randomUUID(), nama: "Sore", urutan: 3 },
        { id: randomUUID(), nama: "Malam", urutan: 4 },
        { id: randomUUID(), nama: "Sahur", urutan: 5 },
        { id: randomUUID(), nama: "Buka Puasa", urutan: 6 },
        { id: randomUUID(), nama: "Snack Malam", urutan: 7 },
        { id: randomUUID(), nama: "Tengah Malam", urutan: 8 }
      ]
    });
  }

  // ====================== MENU ======================
  console.log("📋 Menambahkan menu...");
  const existingMenu = await prisma.menu.count();
  if (existingMenu === 0) {
    const menuData = [
      // Menu Pagi
      ...["Ayam Goreng", "Anggur", "Air Mineral", "Snack Kering", "Snack Pagi", "GKT", "Ketupat Lebaran", "Permen", "Mie Instan", "Teh Sariwangi", "Nescafe", "Roti Manis", "Snack Box", "Kopi Kapal Api Special Mix", "Indocafe Coffemix", "Paket Sembako", "Buah-Buahan", "Creamer", "Teh Celup", "Milo", "Telor Rebus", "Jamuan Diluar Kawasan", "Susu Ultra", "Jeruk Manis", "Pisang Sunpride", "Nasi Putih/Timbel", "Sate Maranggi Sapi", "Parasmanan", "Pocari Sweat", "Teh Kotak", "Aneka Pepes"].map(menu => ({ id: randomUUID(), nama: menu, sesiWaktu: "Pagi" })),
      
      // Menu Siang
      ...["Nasi Box", "Prasmanan", "Ayam Goreng", "Anggur", "Air Mineral", "Snack Kering", "Snack Pagi", "GKT", "Ketupat Lebaran", "Permen", "Mie Instan", "Teh Sariwangi", "Nescafe", "Roti Manis", "Snack", "Kopi Kapal Api Special Mix", "Indocafe Coffemix", "Paket Sembako", "Buah-Buahan", "Creamer", "Teh Celup", "Milo", "Telor Rebus", "Jamuan Diluar Kawasan", "Susu Ultra", "Jeruk Manis", "Pisang Sunpride", "Nasi Putih/Timbel", "Sate Maranggi Sapi", "Parasmanan", "Pocari Sweat", "Teh Kotak", "Aneka Pepes"].map(menu => ({ id: randomUUID(), nama: menu, sesiWaktu: "Siang" })),
      
      // Menu Sore
      ...["Snack Box", "Coffee Break", "Ayam Goreng", "Anggur", "Air Mineral", "Snack Kering", "Snack Pagi", "GKT", "Ketupat Lebaran", "Permen", "Mie Instan", "Teh Sariwangi", "Nescafe", "Roti Manis", "Snack", "Kopi Kapal Api Special Mix", "Indocafe Coffemix", "Paket Sembako", "Buah-Buahan", "Creamer", "Teh Celup", "Milo", "Telor Rebus", "Jamuan Diluar Kawasan", "Susu Ultra", "Jeruk Manis", "Pisang Sunpride", "Nasi Putih/Timbel", "Sate Maranggi Sapi", "Parasmanan", "Pocari Sweat", "Teh Kotak", "Aneka Pepes"].map(menu => ({ id: randomUUID(), nama: menu, sesiWaktu: "Sore" })),
      
      // Menu Malam
      ...["Nasi Box", "Prasmanan", "Ayam Goreng", "Anggur", "Air Mineral", "Snack Kering", "Snack Pagi", "GKT", "Ketupat Lebaran", "Permen", "Mie Instan", "Teh Sariwangi", "Nescafe", "Roti Manis", "Snack", "Kopi Kapal Api Special Mix", "Indocafe Coffemix", "Paket Sembako", "Buah-Buahan", "Creamer", "Teh Celup", "Milo", "Telor Rebus", "Jamuan Diluar Kawasan", "Susu Ultra", "Jeruk Manis", "Pisang Sunpride", "Nasi Putih/Timbel", "Sate Maranggi Sapi", "Parasmanan", "Pocari Sweat", "Teh Kotak", "Aneka Pepes"].map(menu => ({ id: randomUUID(), nama: menu, sesiWaktu: "Malam" })),
      
      // Menu Sahur
      ...["Nasi Box", "Ayam Gorenng", "Sate Maranggi Sapi", "Air Mineral", "Buah-buahan"].map(menu => ({ id: randomUUID(), nama: menu, sesiWaktu: "Sahur" })),
      
      // Menu Buka Puasa
      ...["Nasi Box", "Prasmanan", "Takjil"].map(menu => ({ id: randomUUID(), nama: menu, sesiWaktu: "Buka Puasa" })),
      
      // Menu Snack Malam
      ...["Snack Box", "Nescafe", "Kopi"].map(menu => ({ id: randomUUID(), nama: menu, sesiWaktu: "Snack Malam" })),
      
      // Menu Tengah Malam
      ...["Nasi Box", "Nescafe", "Kopi", "Ayam Goreng"].map(menu => ({ id: randomUUID(), nama: menu, sesiWaktu: "Tengah Malam" }))
    ];

    await prisma.menu.createMany({ data: menuData });
  }
  

  console.log("\n✅ SEEDING BERHASIL!");
}

main()
  .catch(err => console.error(err))
  .finally(() => prisma.$disconnect());
