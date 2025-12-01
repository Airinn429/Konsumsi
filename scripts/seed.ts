import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
const prisma = new PrismaClient();

async function main() {

  // ====================== USER ======================
  await prisma.user.create({
    data: { id: randomUUID(), username: "admin", name: "Administrator", password: "admin123" }
  });
  

  // ====================== BAGIAN ======================
  await prisma.bagian.createMany({
    data: [
      { id: randomUUID(), nama: "Teknologi Informasi" },
      
    ]
  });

  
  // ====================== JENIS KEGIATAN ======================
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


  
  // ====================== APPROVER ======================
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
      { id: randomUUID(), nama: "Mulky Wahyudhy", nip: "3082590" },
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
      { id: randomUUID(), nama: "Sundawa", nip: "3082583" },
      { id: randomUUID(), nama: "Syarifudin", nip: "3052401" },
      { id: randomUUID(), nama: "Toni Gunawan", nip: "3042442" },
      { id: randomUUID(), nama: "Yoyon Daryono", nip: "3072495" },
      { id: randomUUID(), nama: "Yayan Taryana", nip: "3123091" },
      { id: randomUUID(), nama: "Yara Budhi Widowati", nip: "3123084" },
      { id: randomUUID(), nama: "Zaki Faishal Aziz", nip: "3042168" }
    ]
  })


  // ====================== LOKASI ======================
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


  // ====================== JENIS KONSUMSI ======================
  await prisma.jenisKonsumsi.createMany({
    data: [
      { id: randomUUID(), nama: "PERTA" },
      { id: randomUUID(), nama: "Regular" },
      { id: randomUUID(), nama: "Standar" },
      { id: randomUUID(), nama: "VIP" },
      { id: randomUUID(), nama: "VVIP" }
    ]
  });
  

  console.log("SEEDING BERHASIL ✓");
}

main()
  .catch(err => console.error(err))
  .finally(() => prisma.$disconnect());
