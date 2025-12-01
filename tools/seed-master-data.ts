// scripts/seed-master-data.ts
// Script untuk mengisi master data saja (tanpa user & order)
import { PrismaClient } from '@prisma/client';
import { generatePrefixedId } from '../src/lib/id-generator';

const prisma = new PrismaClient();

async function seedMasterData() {
  console.log('📋 Mengisi Master Data...\n');

  try {
    // 1. Jenis Kegiatan (dari konsumsi/index.tsx)
    console.log('📝 Jenis Kegiatan...');
    const jenisKegiatanData = [
      { nama: 'Bahan Minum Karyawan' },
      { nama: 'Baporkes' },
      { nama: 'BK3N' },
      { nama: 'Extra Fooding' },
      { nama: 'Extra Fooding Shift' },
      { nama: 'Extra Fooding SKJ' },
      { nama: 'Festival Inovasi' },
      { nama: 'Halal Bi Halal' },
      { nama: 'Hari Guru' },
      { nama: 'Hari Raya Idu Adha' },
      { nama: 'Hari Raya Idul Fitri' },
      { nama: 'HUT PKC' },
      { nama: 'HUT RI' },
      { nama: 'Jamuan Diluar Kawasan' },
      { nama: 'Jamuan Tamu Perusahaan' },
      { nama: 'Jumat Bersih' },
      { nama: 'Kajian Rutin' },
      { nama: 'Ketupat Lebaran' },
      { nama: 'Konsumsi Buka Puasa' },
      { nama: 'Konsumsi Makan Sahur' },
      { nama: 'Konsumsi TA' },
      { nama: 'Lain-lain Jamuan Tamu' },
      { nama: 'Lain-lain Perayaan' },
      { nama: 'Lain-lain Rapat Kantor' },
      { nama: 'Lembur Perta' },
      { nama: 'Lembur Rutin' },
      { nama: 'Lembur Shutdown' },
      { nama: 'Not Defined' },
      { nama: 'Nuzurul Quran' },
      { nama: 'Open Storage' },
      { nama: 'Pengajian Keliling' },
      { nama: 'Pengantongan Akhir Tahun' },
      { nama: 'Pengembangan SDM' },
      { nama: 'PKM Masjid Nahlul Hayat' },
      { nama: 'Program Akhlak' },
      { nama: 'Program Makmur' },
      { nama: 'Program WMS' },
      { nama: 'Proper Emas' },
      { nama: 'Proyek Replacament K1A & NZE' },
      { nama: 'Rakor Direksi Anper PI Group' },
      { nama: 'Rapat Direksi' },
      { nama: 'Rapat Distribusi B' },
      { nama: 'Rapat Distribusi D' },
      { nama: 'Rapat Gabungan Dekom, Direksi, SVP' },
      { nama: 'Rapat Internal' },
      { nama: 'Rapat Komite Audit' },
      { nama: 'Rapat LKS Bipartit' },
      { nama: 'Rapat Monitoring Anper PKC' },
      { nama: 'Rapat Pra RUPS' },
      { nama: 'Rapat Tamu' },
      { nama: 'Rumah Tahfidz' },
      { nama: 'Safari Malam Takbiran' },
      { nama: 'Safari Ramadhan' },
      { nama: 'Shutdwon Pabrik' },
      { nama: 'SP2K' },
      { nama: 'Srikandi PKC' },
      { nama: 'Tablig Akbar' },
      { nama: 'Washing Pabrik' },
    ];

    for (const data of jenisKegiatanData) {
      const id = await generatePrefixedId(prisma, 'jenisKegiatan');
      await prisma.jenisKegiatan.upsert({
        where: { nama: data.nama },
        update: {},
        create: {
          id,
          ...data,
        },
      });
    }

    console.log(`✅ ${jenisKegiatanData.length} jenis kegiatan dipastikan tersedia`);

    // 2. Bagian/Departemen (dari konsumsi/index.tsx)
    console.log('\n🏢 Bagian/Departemen...');
    await prisma.bagian.createMany({
      data: [
        { nama: 'Teknologi Informasi', kode: 'TI' },
      ],
      skipDuplicates: true,
    });
    console.log('✅ 1 bagian ditambahkan');

    // 3. Approver (dari konsumsi/index.tsx - 56 approvers)
    console.log('\n👤 Approver...');
    const approverData = [
      { nama: 'Arief Darmawan', nip: '3072535' },
      { nama: 'Anggita Maya Septianingsih', nip: '3082589' },
      { nama: 'Agung Gustiawan', nip: '3092789' },
      { nama: 'Andika Arif Rachman', nip: '3082592' },
      { nama: 'Ardhimas Yuda Baskoro', nip: '3042172' },
      { nama: 'Amin Puji Hariyanto', nip: '3133210' },
      { nama: 'Andi Komara', nip: '3072517' },
      { nama: 'Desra Heriman', nip: '3072531' },
      { nama: 'Danang Siswantoro', nip: '3052402' },
      { nama: 'Dady Rahman', nip: '3052404' },
      { nama: 'Dian Ramdani', nip: '3082628' },
      { nama: 'Dede Sopian', nip: '3072524' },
      { nama: 'Dian Risdiana', nip: '3072532' },
      { nama: 'Dodi Pramadi', nip: '3972081' },
      { nama: 'Eka Priyatna', nip: '3102904' },
      { nama: 'Fika Hikmaturrahman', nip: '3123195' },
      { nama: 'Fajar Nugraha', nip: '3022134' },
      { nama: 'Freddy Harianto', nip: '3072526' },
      { nama: 'Febri Rubragandi N', nip: '3052400' },
      { nama: 'Flan Adi Nugraha Suhara', nip: '3052394' },
      { nama: 'Gina Amarilis', nip: '3082590' },
      { nama: 'Henisya Permata Sari', nip: '3072498' },
      { nama: 'Hikmat Rachmatullah', nip: '3072497' },
      { nama: 'Handi Rustian', nip: '3072485' },
      { nama: 'Iswahyudi Mertosono', nip: '3082594' },
      { nama: 'Indra Irianto', nip: '3022136' },
      { nama: 'Ira Purnama Sari', nip: '3072489' },
      { nama: 'Ibrahim Herlambang', nip: '3072488' },
      { nama: 'Jojok Satriadi', nip: '1140122' },
      { nama: 'Jondra', nip: '3052403' },
      { nama: 'Kholiq Iman Santoso', nip: '3253473' },
      { nama: 'Kasmadi', nip: '3072494' },
      { nama: 'Lala', nip: '3072542' },
      { nama: 'Luthfianto Ardian', nip: '3022127' },
      { nama: 'Mohammad Arief Rachman', nip: '3932032' },
      { nama: 'Mulky Wahyudhy', nip: '3082590' },
      { nama: 'Mita Yasmitahati', nip: '3072527' },
      { nama: 'Mohammad Gani', nip: '3092756' },
      { nama: 'Muhammad Ikhsan Anshori', nip: '3133237' },
      { nama: 'Muhammad Yudi Prasetyo', nip: '3072487' },
      { nama: 'Muh. Arifin Hakim Nuryadin', nip: '3972097' },
      { nama: 'Nugraha Agung Wibowo', nip: '3133236' },
      { nama: 'Probo Condrosari', nip: '3072490' },
      { nama: 'Raden Sulistyo', nip: '3072491' },
      { nama: 'R. Idho Pramana Sembada', nip: '3072545' },
      { nama: 'Rosy Indra Saputra', nip: '3072496' },
      { nama: 'Refan Anggasatriya', nip: '3082597' },
      { nama: 'Ronald Irwanto', nip: '3123084' },
      { nama: 'Rahayu Ginanjar Siwi', nip: '3123205' },
      { nama: 'Shinta Narulita', nip: '3082579' },
      { nama: 'Soni Ridho Atmaja', nip: '3082583' },
      { nama: 'Sundawa', nip: '3082583' },
      { nama: 'Syarifudin', nip: '3052401' },
      { nama: 'Toni Gunawan', nip: '3042442' },
      { nama: 'Yoyon Daryono', nip: '3072495' },
      { nama: 'Yayan Taryana', nip: '3123091' },
      { nama: 'Yara Budhi Widowati', nip: '3123084' },
      { nama: 'Zaki Faishal Aziz', nip: '3042168' },
    ];

    for (const data of approverData) {
      const id = await generatePrefixedId(prisma, 'approver');
      await prisma.approver.upsert({
        where: { nip: data.nip },
        update: {},
        create: {
          id,
          ...data,
        },
      });
    }

    console.log(`✅ ${approverData.length} approver dipastikan tersedia`);

    // 4. Lokasi (dari konsumsi/index.tsx - 48 lokasi)
    console.log('\n📍 Lokasi...');
    const lokasiData = [
      { nama: 'Bagging' },
      { nama: 'CCB' },
      { nama: 'Club House' },
      { nama: 'Departemen Riset' },
      { nama: 'Gedung 101-K' },
      { nama: 'Gedung Anggrek' },
      { nama: 'Gedung Bidding Center' },
      { nama: 'Gedung Contraction Office' },
      { nama: 'Gedung K3' },
      { nama: 'Gedung LC' },
      { nama: 'Gedung Maintanance Office' },
      { nama: 'Gedung Mawar' },
      { nama: 'Gedung Melati' },
      { nama: 'Gedung Purna Bhakti' },
      { nama: 'Gedung Pusat Administrasi' },
      { nama: 'Gedung RPK' },
      { nama: 'Gedung Saorga' },
      { nama: 'GH-B' },
      { nama: 'GH-C' },
      { nama: 'GPA Lt-3' },
      { nama: 'Gudang Bahan Baku' },
      { nama: 'Gudang Bulk Material' },
      { nama: 'Gedung Suku Cadang' },
      { nama: 'Jakarta' },
      { nama: 'Kantor SP2K' },
      { nama: 'Kebon Bibit' },
      { nama: 'Klinik PT HPH' },
      { nama: 'Kolam Pancing Type B' },
      { nama: 'Kolam Renang' },
      { nama: 'Kujang Kampioen Riset' },
      { nama: 'Laboraturium/Main Lab' },
      { nama: 'Lapang Basket Type B' },
      { nama: 'Lapang Futsal' },
      { nama: 'Lapang Sepak Bola Type E' },
      { nama: 'Lapang Tenis Type B' },
      { nama: 'Lapang Volly Type E' },
      { nama: 'Lapangan Helipad' },
      { nama: 'Lapangan Panahan' },
      { nama: 'Lapangan Volley' },
      { nama: 'Mekanik K1A' },
      { nama: 'Mekanik K1B' },
      { nama: 'Not Defined' },
      { nama: 'NPK-2' },
      { nama: 'Pos Selatan 01' },
      { nama: 'Posko Pengamanan Bawah' },
      { nama: 'Ruang Rapat NPK-1' },
      { nama: 'Ruang Rapat NPK-2' },
      { nama: 'Utility K-1A' },
      { nama: 'Wisma Kujang' },
    ];

    for (const data of lokasiData) {
      const id = await generatePrefixedId(prisma, 'lokasi');
      await prisma.lokasi.upsert({
        where: { nama: data.nama },
        update: {},
        create: {
          id,
          ...data,
        },
      });
    }

    console.log(`✅ ${lokasiData.length} lokasi dipastikan tersedia`);

    // 5. Jenis Konsumsi (dari konsumsi/index.tsx - semua jenis dari menuByTime & menuByGuestType)
    console.log('\n🍱 Jenis Konsumsi...');
    const jenisKonsumsiData = [
      { nama: 'Nasi Box', kategori: 'Makanan Berat', satuanDefault: 'Box' },
      { nama: 'Prasmanan', kategori: 'Makanan Berat', satuanDefault: 'Pax' },
      { nama: 'Parasmanan', kategori: 'Makanan Berat', satuanDefault: 'Pax' },
      { nama: 'Nasi Putih/Timbel', kategori: 'Makanan Berat', satuanDefault: 'Pax' },
      { nama: 'Bubur Ayam', kategori: 'Makanan Berat', satuanDefault: 'Porsi' },
      { nama: 'GKT', kategori: 'Makanan Berat', satuanDefault: 'Pax' },
      { nama: 'Ayam Goreng', kategori: 'Lauk Pauk', satuanDefault: 'Porsi' },
      { nama: 'Sate Maranggi Sapi', kategori: 'Lauk Pauk', satuanDefault: 'Pax' },
      { nama: 'Aneka Pepes', kategori: 'Lauk Pauk', satuanDefault: 'Porsi' },
      { nama: 'Telor Rebus', kategori: 'Lauk Pauk', satuanDefault: 'Porsi' },
      { nama: 'Snack Box', kategori: 'Snack', satuanDefault: 'Box' },
      { nama: 'Snack', kategori: 'Snack', satuanDefault: 'Porsi' },
      { nama: 'Snack Kering', kategori: 'Snack', satuanDefault: 'Porsi' },
      { nama: 'Snack Pagi', kategori: 'Snack', satuanDefault: 'Porsi' },
      { nama: 'Roti Manis', kategori: 'Snack', satuanDefault: 'Porsi' },
      { nama: 'Coffee Break', kategori: 'Snack', satuanDefault: 'Box' },
      { nama: 'Permen', kategori: 'Snack', satuanDefault: 'Unit' },
      { nama: 'Buah-Buahan', kategori: 'Buah', satuanDefault: 'Porsi' },
      { nama: 'Anggur', kategori: 'Buah', satuanDefault: 'Porsi' },
      { nama: 'Jeruk Manis', kategori: 'Buah', satuanDefault: 'Porsi' },
      { nama: 'Pisang Sunpride', kategori: 'Buah', satuanDefault: 'Porsi' },
      { nama: 'Takjil', kategori: 'Takjil', satuanDefault: 'Porsi' },
      { nama: 'Air Mineral', kategori: 'Minuman', satuanDefault: 'Unit' },
      { nama: 'Galon', kategori: 'Minuman', satuanDefault: 'Unit' },
      { nama: 'Teh Sariwangi', kategori: 'Minuman', satuanDefault: 'Unit' },
      { nama: 'Teh Celup', kategori: 'Minuman', satuanDefault: 'Unit' },
      { nama: 'Teh Kotak', kategori: 'Minuman', satuanDefault: 'Unit' },
      { nama: 'Nescafe', kategori: 'Minuman', satuanDefault: 'Unit' },
      { nama: 'Kopi Kapal Api Special Mix', kategori: 'Minuman', satuanDefault: 'Unit' },
      { nama: 'Kopi', kategori: 'Minuman', satuanDefault: 'Unit' },
      { nama: 'Indocafe Coffemix', kategori: 'Minuman', satuanDefault: 'Unit' },
      { nama: 'Milo', kategori: 'Minuman', satuanDefault: 'Unit' },
      { nama: 'Creamer', kategori: 'Minuman', satuanDefault: 'Unit' },
      { nama: 'Susu Ultra', kategori: 'Minuman', satuanDefault: 'Unit' },
      { nama: 'Pocari Sweat', kategori: 'Minuman', satuanDefault: 'Unit' },
      { nama: 'Ketupat Lebaran', kategori: 'Lain-lain', satuanDefault: 'Pax' },
      { nama: 'Paket Sembako', kategori: 'Lain-lain', satuanDefault: 'Box' },
      { nama: 'Mie Instan', kategori: 'Lain-lain', satuanDefault: 'Unit' },
      { nama: 'Jamuan Diluar Kawasan', kategori: 'Lain-lain', satuanDefault: 'Pax' },
    ];

    for (const data of jenisKonsumsiData) {
      const id = await generatePrefixedId(prisma, 'jenisKonsumsi');
      await prisma.jenisKonsumsi.upsert({
        where: { nama: data.nama },
        update: {},
        create: {
          id,
          ...data,
        },
      });
    }

    console.log(`✅ ${jenisKonsumsiData.length} jenis konsumsi dipastikan tersedia`);

    // Summary
    const counts = {
      jenisKegiatan: await prisma.jenisKegiatan.count(),
      bagian: await prisma.bagian.count(),
      approver: await prisma.approver.count(),
      lokasi: await prisma.lokasi.count(),
      jenisKonsumsi: await prisma.jenisKonsumsi.count(),
    };

    console.log('\n🎉 Master Data berhasil diisi!');
    console.log('\n📊 Total Data:');
    console.log(`   - Jenis Kegiatan: ${counts.jenisKegiatan}`);
    console.log(`   - Bagian: ${counts.bagian}`);
    console.log(`   - Approver: ${counts.approver}`);
    console.log(`   - Lokasi: ${counts.lokasi}`);
    console.log(`   - Jenis Konsumsi: ${counts.jenisKonsumsi}`);
    console.log('\n✨ Data 100% disesuaikan dengan konsumsi/index.tsx');
    console.log('📊 Cek di Prisma Studio: http://localhost:5555');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Jalankan
seedMasterData();
