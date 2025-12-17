const { PrismaClient } = require("@prisma/client");
const { randomUUID } = require("crypto");
const { hashPassword } = require("../src/lib/password");

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Mulai seeding database...\n");

  // USER
  console.log("👤 Menambahkan users...");

  const users = [
    {
      username: "nadia",
      name: "Nadia Addnan",
      email: "nadia@demplon.com",
      password: await hashPassword("123456"),
      role: "user",
      bagianId: "Teknologi Informasi",
    },
    {
      username: "fauzi",
      name: "Fauzi",
      email: "fauzi@demplon.com",
      password: await hashPassword("654321"),
      role: "user",
    },
    {
      username: "dika",
      name: "Dika",
      email: "dika@demplon.com",
      password: await hashPassword("112233"),
      role: "user",},
     {
      username: "Riza Ilhamsyah",
      name: "Riza Ilhamsyah",
      email: "riza@demplon.com",
      password: await hashPassword("0011223"),
      role: "user",
    },
    {
      username: "Addnan",
      name: "Addnan",
      email: "addnan@demplon.com",
      password: await hashPassword("098765"),
      role: "Approver",
    },
     {
      username: "Jojok Satriadi",
      name: "Jojok Satriadi",
      email: "jojok@demplon.com",
      password: await hashPassword("12345"),
      role: "Approver",
    },
     {
      username: "Indra",
      name: "Indra",
      email: "indra@demplon.com",
      password: await hashPassword("009988"),
      role: "Approver",
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: { id: randomUUID(), ...u },
    });
  }

  //BAGIAN
  console.log("📋 Menambahkan bagian...");

  await prisma.bagian.createMany({
    data: [{ id: randomUUID(), nama: "Teknologi Informasi" }, { id: randomUUID(), nama: "Manajemen & Pengembangan" }, { id: randomUUID(), nama: "Pelayanan Umum" }],
    skipDuplicates: true
  });

  // JENIS KEGIATAN
  console.log("📋 Menambahkan jenis kegiatan...");

  const jenisKegiatanList = [
    "Bahan Minum Karyawan","Baporkes","BK3N","Extra Fooding","Extra Fooding Shift","Extra Fooding SKJ",
    "Festival Inovasi","Halal Bi Halal","Hari Guru","Hari Raya Idu Adha","Hari Raya Idul Fitri","HUT PKC",
    "HUT RI","Jamuan Diluar Kawasan","Jamuan Tamu Perusahaan","Jumat Bersih","Kajian Rutin","Ketupat Lebaran",
    "Konsumsi Buka Puasa","Konsumsi Makan Sahur","Konsumsi TA","Lain-lain Jamuan Tamu","Lain-lain Perayaan",
    "Lain-lain Rapat Kantor","Lembur Perta","Lembur Rutin","Lembur Shutdown","Not Defined","Nuzurul Quran",
    "Open Storage","Pengajian Keliling","Pengantongan Akhir Tahun","Pengembangan SDM","PKM Masjid Nahlul Hayat",
    "Program Akhlak","Program Makmur","Program WMS","Proper Emas","Proyek Replacament K1A & NZE",
    "Rakor Direksi Anper PI Group","Rapat Direksi","Rapat Distribusi B","Rapat Distribusi D",
    "Rapat Gabungan Dekom, Direksi, SVP","Rapat Internal","Rapat Komite Audit","Rapat LKS Bipartit",
    "Rapat Monitoring Anper PKC","Rapat Pra RUPS","Rapat Tamu","Rumah Tahfidz","Safari Malam Takbiran",
    "Safari Ramadhan","Shutdwon Pabrik","SP2K","Srikandi PKC","Tablig Akbar","Washing Pabrik"
  ];

  await prisma.jenisKegiatan.createMany({
    data: jenisKegiatanList.map(nama => ({ id: randomUUID(), nama })),
    skipDuplicates: true
  });

  // APPROVER
  console.log("📋 Menambahkan approver...");

  const approverList = [
    ["Arief Darmawan","3072535"],["Anggita Maya Septianingsih","3082589"],["Agung Gustiawan","3092789"],
    ["Andika Arif Rachman","3082592"],["Ardhimas Yuda Baskoro","3042172"],["Amin Puji Hariyanto","3133210"],
    ["Andi Komara","3072517"],["Desra Heriman","3072531"],["Danang Siswantoro","3052402"],
    ["Dady Rahman","3052404"],["Dian Ramdani","3082628"],["Dede Sopian","3072524"],
    ["Dian Risdiana","3072532"],["Dodi Pramadi","3972081"],["Eka Priyatna","3102904"],
    ["Fika Hikmaturrahman","3123195"],["Fajar Nugraha","3022134"],["Freddy Harianto","3072526"],
    ["Febri Rubragandi N","3052400"],["Flan Adi Nugraha Suhara","3052394"],["Gina Amarilis","3082590"],
    ["Henisya Permata Sari","3072498"],["Hikmat Rachmatullah","3072497"],["Handi Rustian","3072485"],
    ["Iswahyudi Mertosono","3082594"],["Indra Irianto","3022136"],["Ira Purnama Sari","3072489"],
    ["Ibrahim Herlambang","3072488"],["Jojok Satriadi","1140122"],["Jondra","3052403"],
    ["Kholiq Iman Santoso","3253473"],["Kasmadi","3072494"],["Lala","3072542"],
    ["Luthfianto Ardian","3022127"],["Mohammad Arief Rachman","3932032"],["Mulky Wahyudhy","3082591"],
    ["Mita Yasmitahati","3072527"],["Mohammad Gani","3092756"],["Muhammad Ikhsan Anshori","3133237"],
    ["Muhammad Yudi Prasetyo","3072487"],["Muh. Arifin Hakim Nuryadin","3972097"],["Nugraha Agung Wibowo","3133236"],
    ["Probo Condrosari","3072490"],["Raden Sulistyo","3072491"],["R. Idho Pramana Sembada","3072545"],
    ["Rosy Indra Saputra","3072496"],["Refan Anggasatriya","3082597"],["Ronald Irwanto","3123084"],
    ["Rahayu Ginanjar Siwi","3123205"],["Shinta Narulita","3082579"],["Soni Ridho Atmaja","3082583"],
    ["Sundawa","3082584"],["Syarifudin","3052401"],["Toni Gunawan","3042442"],
    ["Yoyon Daryono","3072495"],["Yayan Taryana","3123091"],["Yara Budhi Widowati","3123085"],
    ["Zaki Faishal Aziz","3042168"]
  ];

  await prisma.approver.createMany({
    data: approverList.map(([nama, nip]) => ({ id: randomUUID(), nama, nip })),
    skipDuplicates: true
  });

  //LOKASI
  console.log("📋 Menambahkan lokasi...");

  const lokasiList = [
    "Bagging","CCB","Club House","Departemen Riset","Gedung 101-K","Gedung Anggrek","Gedung Bidding Center",
    "Gedung Contraction Office","Gedung K3","Gedung LC","Gedung Maintanance Office","Gedung Mawar",
    "Gedung Melati","Gedung Purna Bhakti","Gedung Pusat Administrasi","Gedung RPK","Gedung Saorga",
    "GH-B","GH-C","GPA Lt-3","Gudang Bahan Baku","Gudang Bulk Material","Gedung Suku Cadang","Jakarta",
    "Kantor SP2K","Kebon Bibit","Klinik PT HPH","Kolam Pancing Type B","Kolam Renang","Kujang Kampioen Riset",
    "Laboraturium/Main Lab","Lapang Basket Type B","Lapang Futsal","Lapang Sepak Bola Type E",
    "Lapang Tenis Type B","Lapang Volly Type E","Lapangan Helipad","Lapangan Panahan","Lapangan Volley",
    "Mekanik K1A","Mekanik K1B","Not Defined","NPK-2","Pos Selatan 01","Posko Pengamanan Bawah",
    "Ruang Rapat NPK-1","Ruang Rapat NPK-2","Utility K-1A","Wisma Kujang"
  ];

  await prisma.lokasi.createMany({
    data: lokasiList.map(nama => ({ id: randomUUID(), nama })),
    skipDuplicates: true
  });

  //JENIS KONSUMSI
  console.log("📋 Menambahkan jenis konsumsi...");

  const jenisKonsumsi = ["PERTA","Regular","Standar","VIP","VVIP"];

  await prisma.jenisKonsumsi.createMany({
    data: jenisKonsumsi.map(nama => ({ id: randomUUID(), nama })),
    skipDuplicates: true
  });

  // SELESAI
  console.log("\n✅ SEEDING BERHASIL (sekali saja)!");
}

main()
  .catch(err => console.error(err))
  .finally(() => prisma.$disconnect());