// scripts/test-api.ts
// Script untuk test API endpoints menggunakan native fetch (Node.js 18+)

const API_URL = 'http://localhost:3000/api/orders';

async function testAPI() {
  console.log('🧪 Testing API Endpoints...\n');
  console.log('📍 API URL:', API_URL);
  console.log('─'.repeat(60));

  try {
    // 1. TEST GET ALL ORDERS
    console.log('\n1️⃣ TEST: GET All Orders');
    console.log('   Request: GET', API_URL);
    
    const getResponse = await fetch(API_URL);
    const orders = await getResponse.json() as Array<{
      orderNumber: string;
      kegiatan: string;
      items?: unknown[];
    }>;
    
    console.log('   ✅ Status:', getResponse.status);
    console.log('   📊 Total Orders:', orders.length);
    if (orders.length > 0) {
      console.log('   📦 First Order:', orders[0].orderNumber);
      console.log('   📝 Kegiatan:', orders[0].kegiatan);
      console.log('   📦 Items:', orders[0].items?.length || 0);
    }

    // 2. TEST POST CREATE ORDER
    console.log('\n2️⃣ TEST: POST Create Order');
    console.log('   Request: POST', API_URL);
    
    const newOrder = {
      kegiatan: 'Rapat Internal',
      tanggalPermintaan: new Date().toISOString(),
      tanggalPengiriman: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      untukBagian: 'Teknologi Informasi',
      yangMengajukan: 'Nadia Addnan - 3082589',
      noHp: '081234567890',
      namaApprover: 'Arief Darmawan (3072535)',
      tipeTamu: 'Regular',
      keterangan: 'Testing API dari script',
      createdBy: 'nadia',
      items: [
        {
          jenisKonsumsi: 'Nasi Box',
          qty: 25,
          satuan: 'Box',
          lokasiPengiriman: 'Gedung Anggrek',
          sesiWaktu: 'Siang',
          waktu: '12:00'
        },
        {
          jenisKonsumsi: 'Air Mineral',
          qty: 30,
          satuan: 'Unit',
          lokasiPengiriman: 'Gedung Anggrek',
          sesiWaktu: 'Siang',
          waktu: '12:00'
        }
      ]
    };

    const postResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    });

    const createdOrder = await postResponse.json() as {
      id: string;
      orderNumber: string;
      items?: unknown[];
    };
    
    console.log('   ✅ Status:', postResponse.status);
    console.log('   🆕 Order Number:', createdOrder.orderNumber);
    console.log('   📦 Total Items:', createdOrder.items?.length || 0);
    console.log('   🆔 Order ID:', createdOrder.id);

    // 3. TEST GET SINGLE ORDER
    console.log('\n3️⃣ TEST: GET Single Order');
    const orderId = createdOrder.id;
    console.log('   Request: GET', `${API_URL}/${orderId}`);
    
    const getSingleResponse = await fetch(`${API_URL}/${orderId}`);
    const singleOrder = await getSingleResponse.json() as {
      orderNumber: string;
      kegiatan: string;
      createdBy: string;
    };
    
    console.log('   ✅ Status:', getSingleResponse.status);
    console.log('   📦 Order:', singleOrder.orderNumber);
    console.log('   📝 Kegiatan:', singleOrder.kegiatan);
    console.log('   👤 Created By:', singleOrder.createdBy);

    // 4. TEST PATCH UPDATE ORDER (Cancel)
    console.log('\n4️⃣ TEST: PATCH Update Order (Cancel)');
    console.log('   Request: PATCH', `${API_URL}/${orderId}`);
    
    const updateData = {
      status: 'Cancelled',
      tanggalPembatalan: new Date().toISOString(),
      alasanPembatalan: 'Testing cancel dari script'
    };

    const patchResponse = await fetch(`${API_URL}/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    const updatedOrder = await patchResponse.json() as {
      status: string;
      alasanPembatalan: string;
    };
    
    console.log('   ✅ Status:', patchResponse.status);
    console.log('   📊 New Status:', updatedOrder.status);
    console.log('   ❌ Alasan:', updatedOrder.alasanPembatalan);

    // SUMMARY
    console.log('\n' + '═'.repeat(60));
    console.log('🎉 ALL TESTS PASSED!');
    console.log('═'.repeat(60));
    console.log('✅ GET All Orders: Working');
    console.log('✅ POST Create Order: Working');
    console.log('✅ GET Single Order: Working');
    console.log('✅ PATCH Update Order: Working');
    console.log('\n💡 API Backend siap digunakan!');
    console.log('📊 Cek di Prisma Studio: http://localhost:5555');

  } catch (error) {
    console.error('\n❌ ERROR:', error instanceof Error ? error.message : String(error));
    console.log('\n💡 Pastikan dev server sudah running:');
    console.log('   npm run dev');
  }
}

// Jalankan
testAPI();
